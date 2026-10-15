<?php

use App\Models\Page;
use App\Support\ContentCache;
use Illuminate\Database\Migrations\Migration;

/** Home joins the main menu (it follows the same "Show in menu" switch as other pages). */
return new class extends Migration
{
    public function up(): void
    {
        Page::query()->where('key', 'home')->update(['show_in_nav' => true, 'nav_order' => 0]);
        ContentCache::flush();
    }

    public function down(): void
    {
        Page::query()->where('key', 'home')->update(['show_in_nav' => false]);
        ContentCache::flush();
    }
};
