<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // A single row: who the site is about, and site-wide SEO defaults.
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('short_name');
            $table->json('alternate_names')->nullable();
            $table->string('job_title');
            $table->string('organization_name')->nullable();
            $table->string('organization_url')->nullable();
            $table->string('positioning');
            $table->string('location')->nullable();
            $table->string('email');
            $table->string('linkedin_url')->nullable();
            $table->json('same_as')->nullable();
            $table->string('portrait_path')->nullable();
            $table->string('default_og_image_path')->nullable();
            $table->string('site_url');
            $table->string('google_site_verification')->nullable();
            $table->string('bing_site_verification')->nullable();
            $table->timestamps();
        });

        // One row per fixed page (home, about, writing, ventures, contact).
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('nav_label');
            $table->boolean('show_in_nav')->default(true);
            $table->unsignedInteger('nav_order')->default(0);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('og_image_path')->nullable();
            $table->json('content')->nullable();
            $table->timestamps();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('excerpt');
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->longText('body')->nullable();
            $table->string('cover_image_path')->nullable();
            $table->string('status')->default('draft')->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->boolean('featured')->default(false);
            $table->unsignedSmallInteger('reading_minutes')->default(1);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();
        });

        Schema::create('ventures', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('tagline');
            $table->string('role');
            $table->text('description');
            $table->text('problem')->nullable();
            $table->text('product')->nullable();
            $table->json('milestones')->nullable();
            $table->string('website_url')->nullable();
            $table->string('cover_image_path')->nullable();
            $table->json('screenshots')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->boolean('is_visible')->default(true);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('subject');
            $table->text('message');
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('ventures');
        Schema::dropIfExists('articles');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('pages');
        Schema::dropIfExists('site_settings');
    }
};
