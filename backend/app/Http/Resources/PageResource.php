<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Page */
class PageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'key' => $this->key,
            'path' => $this->path(),
            'content' => $this->content ?? (object) [],
            'seo' => SeoData::make($this->meta_title, $this->meta_description, $this->og_image_path),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
