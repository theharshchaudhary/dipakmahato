<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ContactMessage;
use App\Models\Page;
use Database\Seeders\ContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContentApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ContentSeeder::class);
    }

    private function publish(string $slug, array $extra = []): Article
    {
        $article = Article::query()->where('slug', $slug)->firstOrFail();
        $article->update(['status' => 'published', ...$extra]);

        return $article;
    }

    public function test_site_returns_identity_and_navigation(): void
    {
        $this->getJson('/api/site')
            ->assertOk()
            ->assertJsonPath('fullName', 'Dipak Kumar Mahato')
            ->assertJsonPath('alternateNames', ['Dipak Mahato', 'Dipak K. Mahato'])
            ->assertJsonCount(4, 'nav')
            ->assertJsonPath('nav.0.path', '/about');
    }

    public function test_every_fixed_page_is_served_and_unknown_keys_404(): void
    {
        foreach (array_keys(Page::PATHS) as $key) {
            $this->getJson("/api/pages/{$key}")->assertOk()->assertJsonPath('key', $key);
        }

        $this->getJson('/api/pages/nope')->assertNotFound();
    }

    public function test_drafts_are_hidden_until_published(): void
    {
        $this->getJson('/api/articles')->assertOk()->assertJsonCount(0, 'articles');
        $this->getJson('/api/articles/same-menu-price')->assertNotFound();

        $this->publish('same-menu-price');

        $this->getJson('/api/articles')->assertJsonCount(1, 'articles');
        $this->getJson('/api/articles/same-menu-price')
            ->assertOk()
            ->assertJsonPath('article.toc.0', ['id' => 'the-hidden-gap', 'heading' => 'The hidden gap'])
            ->assertJsonPath('article.seo.title', "Same Menu Price: Why Zedfo Doesn't Mark Up Your Food");
    }

    public function test_scheduled_articles_stay_hidden_until_their_date(): void
    {
        $this->publish('same-menu-price', ['published_at' => now()->addDay()]);

        $this->getJson('/api/articles/same-menu-price')->assertNotFound();
    }

    public function test_article_body_is_sanitised(): void
    {
        $this->publish('same-menu-price', [
            'body' => '<h2>Hi</h2><p onclick="x()">Text</p><script>alert(1)</script>',
        ]);

        $html = $this->getJson('/api/articles/same-menu-price')->json('article.html');

        $this->assertStringNotContainsString('<script', $html);
        $this->assertStringNotContainsString('onclick', $html);
        $this->assertStringContainsString('<h2 id="hi">Hi</h2>', $html);
    }

    public function test_sitemap_lists_pages_and_published_articles_only(): void
    {
        $this->publish('same-menu-price');

        $paths = collect($this->getJson('/api/sitemap')->assertOk()->json())->pluck('path');

        $this->assertEqualsCanonicalizing(
            ['/', '/about', '/writing', '/ventures', '/contact', '/writing/same-menu-price'],
            $paths->all(),
        );
    }

    public function test_cached_responses_refresh_when_content_changes(): void
    {
        $this->getJson('/api/pages/home')
            ->assertJsonPath('content.heroQuestion', "Isn't it time delivery played fair?");

        $page = Page::query()->where('key', 'home')->first();
        $page->update(['content' => [...$page->content, 'heroQuestion' => 'New question']]);

        $this->getJson('/api/pages/home')->assertJsonPath('content.heroQuestion', 'New question');
    }

    public function test_contact_form_stores_message(): void
    {
        $this->postJson('/api/contact', [
            'name' => 'Asha',
            'email' => 'asha@example.com',
            'subject' => 'Partnership',
            'message' => 'Hello, I would like to talk.',
        ])->assertCreated();

        $this->assertDatabaseHas(ContactMessage::class, ['email' => 'asha@example.com']);
    }

    public function test_contact_form_validates_and_rejects_bots(): void
    {
        $this->postJson('/api/contact', ['email' => 'not-an-email'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'subject', 'message']);

        $this->postJson('/api/contact', [
            'name' => 'Bot',
            'email' => 'bot@example.com',
            'subject' => 'Hi',
            'message' => 'Buy cheap things now',
            'website' => 'http://spam.example',
        ])->assertUnprocessable();

        $this->assertDatabaseCount(ContactMessage::class, 0);
    }

    public function test_site_includes_default_theme(): void
    {
        $this->getJson('/api/site')
            ->assertJsonPath('theme.headingFont', 'anek')
            ->assertJsonPath('theme.darkMode', 'auto')
            ->assertJsonPath('theme.light.footer', '#000000');
    }

    public function test_page_image_paths_become_urls(): void
    {
        $page = Page::query()->where('key', 'home')->first();
        $page->update(['content' => [...$page->content, 'heroImage' => 'pages/me.png']]);

        $url = $this->getJson('/api/pages/home')->json('content.heroImage');
        $this->assertStringEndsWith('/storage/pages/me.png', $url);
        $this->getJson('/api/pages/home')->assertJsonCount(4, 'content.sections');
    }
}
