<?php

use App\Models\Page;
use App\Support\ContentCache;
use App\Support\HomeHeroDefaults;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Arr;

/**
 * The home hero was redesigned with new editable fields. Give existing sites
 * the starting copy without overwriting anything an editor already set.
 */
return new class extends Migration
{
    public function up(): void
    {
        $home = Page::query()->where('key', 'home')->first();
        if (! $home) {
            return;
        }

        $content = $home->content ?? [];
        $home->update([
            'content' => [
                ...HomeHeroDefaults::CONTENT,
                ...Arr::except($content, HomeHeroDefaults::RETIRED),
            ],
        ]);
        ContentCache::flush();
    }

    public function down(): void
    {
        $home = Page::query()->where('key', 'home')->first();
        $home?->update(['content' => Arr::except($home->content ?? [], array_keys(HomeHeroDefaults::CONTENT))]);
    }
};
