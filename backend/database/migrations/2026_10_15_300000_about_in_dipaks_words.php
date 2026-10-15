<?php

use App\Models\Page;
use App\Support\ContentCache;
use Database\Seeders\ContentSeeder;
use Illuminate\Database\Migrations\Migration;

/** About page: Dipak's full description as one paragraph, replacing the split sections. */
return new class extends Migration
{
    public function up(): void
    {
        $about = Page::query()->where('key', 'about')->first();
        if (! $about) {
            return;
        }

        $new = ContentSeeder::aboutContent();
        $about->update(['content' => [
            ...($about->content ?? []),
            'lead' => $new['lead'],
            'sections' => $new['sections'],
        ]]);
        ContentCache::flush();
    }

    public function down(): void
    {
        // Content change only; nothing to undo structurally.
    }
};
