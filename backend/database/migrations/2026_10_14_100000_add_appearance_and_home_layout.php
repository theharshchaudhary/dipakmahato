<?php

use App\Models\Page;
use App\Support\ContentCache;
use App\Support\HomeHeroDefaults;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Design settings (colours, fonts, branding, custom CSS) for the Appearance
 * screen, and an editable section order for the home page.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->json('theme')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('favicon_path')->nullable();
            $table->string('footer_note')->nullable();
            $table->text('custom_css')->nullable();
        });

        $home = Page::query()->where('key', 'home')->first();
        if ($home) {
            $home->update(['content' => [
                'heroImage' => null,
                'sections' => HomeHeroDefaults::SECTIONS,
                ...($home->content ?? []),
            ]]);
            ContentCache::flush();
        }
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn(['theme', 'logo_path', 'favicon_path', 'footer_note', 'custom_css']);
        });
    }
};
