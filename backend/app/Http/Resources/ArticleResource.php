<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

/** @mixin \App\Models\Article */
class ArticleResource extends ArticleSummaryResource
{
    public function toArray(Request $request): array
    {
        $body = $this->renderedBody();

        return [
            ...parent::toArray($request),
            'html' => $body['html'],
            'toc' => $body['toc'],
            'seo' => SeoData::make(
                $this->meta_title ?: $this->title,
                $this->meta_description ?: $this->excerpt,
                $this->cover_image_path,
            ),
        ];
    }
}
