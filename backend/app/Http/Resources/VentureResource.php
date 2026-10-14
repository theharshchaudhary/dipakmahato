<?php

namespace App\Http\Resources;

use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Venture */
class VentureResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'tagline' => $this->tagline,
            'role' => $this->role,
            'description' => $this->description,
            'problem' => $this->problem,
            'product' => $this->product,
            'milestones' => array_values($this->milestones ?? []),
            'website' => $this->website_url,
            'logo' => Media::url($this->logo_path),
            'coverImage' => Media::url($this->cover_image_path),
            'screenshots' => array_values(array_filter(array_map(Media::url(...), $this->screenshots ?? []))),
            'primary' => $this->is_primary,
        ];
    }
}
