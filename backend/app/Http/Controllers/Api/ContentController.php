<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\ArticleSummaryResource;
use App\Http\Resources\PageResource;
use App\Http\Resources\SiteResource;
use App\Http\Resources\VentureResource;
use App\Models\Article;
use App\Models\Category;
use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\Venture;
use App\Support\ContentCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Read-only content for the public site. Every response is cached until content changes. */
class ContentController extends Controller
{
    public function site(Request $request): JsonResponse
    {
        return $this->cached('site', fn () => (new SiteResource(SiteSetting::current()))->resolve($request));
    }

    public function page(Request $request, string $key): JsonResponse
    {
        abort_unless(array_key_exists($key, Page::PATHS), 404);

        return $this->cached("page:{$key}", fn () => (new PageResource(
            Page::query()->where('key', $key)->firstOrFail()
        ))->resolve($request));
    }

    public function articles(Request $request): JsonResponse
    {
        return $this->cached('articles', fn () => [
            'categories' => Category::query()
                ->whereHas('articles', fn ($q) => $q->published())
                ->orderBy('sort')
                ->get(['name', 'slug']),
            'articles' => ArticleSummaryResource::collection(
                Article::query()->published()->with('category')->latest('published_at')->get()
            )->resolve($request),
        ]);
    }

    public function article(Request $request, string $slug): JsonResponse
    {
        return $this->cached("article:{$slug}", function () use ($request, $slug) {
            $article = Article::query()->published()->with('category')->where('slug', $slug)->firstOrFail();

            $related = Article::query()->published()->with('category')
                ->whereKeyNot($article->getKey())
                ->orderByRaw('case when category_id = ? then 0 else 1 end', [$article->category_id])
                ->latest('published_at')
                ->limit(3)
                ->get();

            return [
                'article' => (new ArticleResource($article))->resolve($request),
                'related' => ArticleSummaryResource::collection($related)->resolve($request),
            ];
        });
    }

    public function ventures(Request $request): JsonResponse
    {
        return $this->cached('ventures', fn () => VentureResource::collection(
            Venture::query()->visible()->get()
        )->resolve($request));
    }

    /** Every public URL with its last-modified time, for the frontend's sitemap.xml. */
    public function sitemap(): JsonResponse
    {
        return $this->cached('sitemap', fn () => [
            ...Page::query()->get()->map(fn (Page $page) => [
                'path' => $page->path(),
                'lastModified' => $page->updated_at?->toIso8601String(),
            ]),
            ...Article::query()->published()->get(['slug', 'updated_at'])->map(fn (Article $a) => [
                'path' => "/writing/{$a->slug}",
                'lastModified' => $a->updated_at?->toIso8601String(),
            ]),
        ]);
    }

    private function cached(string $key, \Closure $build): JsonResponse
    {
        return response()->json(ContentCache::remember($key, $build));
    }
}
