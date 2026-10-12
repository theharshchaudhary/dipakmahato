<?php

namespace App\Models;

use App\Models\Concerns\FlushesContentCache;
use Filament\Forms\Components\RichEditor\RichContentRenderer;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Article extends Model
{
    use FlushesContentCache;

    public const WORDS_PER_MINUTE = 220;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'featured' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Article $article) {
            $words = str_word_count(strip_tags($article->renderer()->toText()));
            $article->reading_minutes = max(1, (int) ceil($words / self::WORDS_PER_MINUTE));

            if ($article->status === 'published' && ! $article->published_at) {
                $article->published_at = now();
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /** Only articles that are published and whose publish date has arrived. */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function isLive(): bool
    {
        return $this->status === 'published' && $this->published_at?->isPast();
    }

    /**
     * Sanitised body HTML with an id on every h2, plus a table of contents
     * built from those headings.
     *
     * @return array{html: string, toc: list<array{id: string, heading: string}>}
     */
    public function renderedBody(): array
    {
        $toc = [];
        $used = [];

        $html = preg_replace_callback('/<h2([^>]*)>(.*?)<\/h2>/is', function (array $m) use (&$toc, &$used) {
            $text = trim(html_entity_decode(strip_tags($m[2])));
            $base = Str::slug($text) ?: 'section';
            $id = $base;
            for ($i = 2; isset($used[$id]); $i++) {
                $id = "{$base}-{$i}";
            }
            $used[$id] = true;
            $toc[] = ['id' => $id, 'heading' => $text];
            $attrs = preg_replace('/\s+id="[^"]*"/i', '', $m[1]);

            return "<h2 id=\"{$id}\"{$attrs}>{$m[2]}</h2>";
        }, $this->renderer()->toHtml());

        return ['html' => $html, 'toc' => $toc];
    }

    private function renderer(): RichContentRenderer
    {
        return RichContentRenderer::make($this->body ?? '')->fileAttachmentsDisk('public');
    }
}
