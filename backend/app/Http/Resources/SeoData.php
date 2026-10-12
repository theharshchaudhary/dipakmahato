<?php

namespace App\Http\Resources;

use App\Support\Media;

/** Normalised SEO block shared by pages and articles. */
class SeoData
{
    public static function make(?string $title, ?string $description, ?string $imagePath): array
    {
        return [
            'title' => $title,
            'description' => $description,
            'image' => Media::url($imagePath),
        ];
    }
}
