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
            ->assertJsonPath('alternateNames', ['Dipak Mahato'])
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
        $this->getJson('/api/articles/learning-through-execution')->assertNotFound();

        $this->publish('learning-through-execution');

        $this->getJson('/api/articles')->assertJsonCount(1, 'articles');
        $this->getJson('/api/articles/learning-through-execution')
            ->assertOk()
            ->assertJsonPath('article.toc.0', ['id' => 'the-context', 'heading' => 'The context'])
            ->assertJsonPath('article.seo.title', 'Learning Through Execution');
    }

    public function test_scheduled_articles_stay_hidden_until_their_date(): void
    {
        $this->publish('learning-through-execution', ['published_at' => now()->addDay()]);

        $this->getJson('/api/articles/learning-through-execution')->assertNotFound();
    }

    public function test_article_body_is_sanitised(): void
    {
        $this->publish('learning-through-execution', [
            'body' => '<h2>Hi</h2><p onclick="x()">Text</p><script>alert(1)</script>',
        ]);

        $html = $this->getJson('/api/articles/learning-through-execution')->json('article.html');

        $this->assertStringNotContainsString('<script', $html);
        $this->assertStringNotContainsString('onclick', $html);
        $this->assertStringContainsString('<h2 id="hi">Hi</h2>', $html);
    }

    public function test_sitemap_lists_pages_and_published_articles_only(): void
    {
        $this->publish('learning-through-execution');

        $paths = collect($this->getJson('/api/sitemap')->assertOk()->json())->pluck('path');

        $this->assertEqualsCanonicalizing(
            ['/', '/about', '/writing', '/ventures', '/contact', '/writing/learning-through-execution'],
            $paths->all(),
        );
    }

    public function test_cached_responses_refresh_when_content_changes(): void
    {
        $this->getJson('/api/pages/home')
            ->assertJsonPath('content.heroHeadline', 'Building useful businesses in Nepal.');

        $page = Page::query()->where('key', 'home')->first();
        $page->update(['content' => [...$page->content, 'heroHeadline' => 'New headline']]);

        $this->getJson('/api/pages/home')->assertJsonPath('content.heroHeadline', 'New headline');
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
}
