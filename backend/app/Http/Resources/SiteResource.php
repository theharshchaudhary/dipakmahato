<?php

namespace App\Http\Resources;

use App\Models\Page;
use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\SiteSetting */
class SiteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'fullName' => $this->full_name,
            'shortName' => $this->short_name,
            'alternateNames' => array_values($this->alternate_names ?? []),
            'jobTitle' => $this->job_title,
            'organization' => $this->organization_name ? [
                'name' => $this->organization_name,
                'url' => $this->organization_url,
            ] : null,
            'positioning' => $this->positioning,
            'location' => $this->location,
            'email' => $this->email,
            'linkedin' => $this->linkedin_url,
            'sameAs' => array_values(array_filter([$this->linkedin_url, ...($this->same_as ?? [])])),
            'portrait' => Media::url($this->portrait_path),
            'defaultOgImage' => Media::url($this->default_og_image_path),
            'siteUrl' => rtrim($this->site_url, '/'),
            'verification' => [
                'google' => $this->google_site_verification,
                'bing' => $this->bing_site_verification,
            ],
            'theme' => $this->resolvedTheme(),
            'logo' => Media::url($this->logo_path),
            'favicon' => Media::url($this->favicon_path),
            'footerNote' => $this->footer_note,
            'customCss' => $this->custom_css,
            'nav' => Page::query()
                ->where('show_in_nav', true)
                ->where('key', '!=', 'home')
                ->orderBy('nav_order')
                ->get()
                ->map(fn (Page $page) => [
                    'label' => $page->nav_label,
                    'path' => $page->path(),
                    'key' => $page->key,
                ])
                ->values(),
        ];
    }
}
