<?php

namespace App\Http\Resources;

use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

/** @mixin \App\Models\Page */
class PageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'key' => $this->key,
            'path' => $this->path(),
            'content' => $this->content ? $this->resolveImages($this->content) : (object) [],
            'seo' => SeoData::make($this->meta_title, $this->meta_description, $this->og_image_path),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }

    /** Content fields named "...Image" hold upload paths; the frontend needs full URLs. */
    private function resolveImages(array $content): array
    {
        foreach ($content as $key => $value) {
            if (Str::endsWith((string) $key, 'Image') && (is_string($value) || $value === null)) {
                $content[$key] = Media::url($value);
            }
        }

        return $content;
    }
}
