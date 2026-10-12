<?php

namespace Tests\Feature;

use App\Filament\Pages\ManageSiteSettings;
use App\Filament\Resources\Articles\Pages\CreateArticle;
use App\Filament\Resources\Pages\Pages\EditPage;
use App\Models\Article;
use App\Models\ContactMessage;
use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\User;
use Database\Seeders\ContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ContentSeeder::class);
        $this->actingAs(User::factory()->create());
    }

    public function test_guests_are_sent_to_login(): void
    {
        auth()->logout();

        $this->get('/admin')->assertRedirect('/admin/login');
    }

    public function test_every_admin_screen_renders(): void
    {
        $page = Page::query()->first();
        $article = Article::query()->first();
        $message = ContactMessage::create([
            'name' => 'A', 'email' => 'a@example.com', 'subject' => 'S', 'message' => 'Message body',
        ]);

        $urls = [
            '/admin', '/admin/pages', '/admin/articles', '/admin/articles/create',
            "/admin/articles/{$article->id}/edit", '/admin/categories', '/admin/ventures',
            '/admin/ventures/create', '/admin/contact-messages', "/admin/contact-messages/{$message->id}",
            '/admin/users', '/admin/manage-site-settings',
        ];
        foreach (Page::all() as $page) {
            $urls[] = "/admin/pages/{$page->id}/edit";
        }

        foreach ($urls as $url) {
            $this->get($url)->assertOk();
        }

        $this->assertNotNull($message->fresh()->read_at, 'Viewing a message marks it read');
    }

    public function test_page_form_edits_content_without_losing_other_fields(): void
    {
        $home = Page::query()->where('key', 'home')->first();

        Livewire::test(EditPage::class, ['record' => $home->getRouteKey()])
            ->fillForm(['content.heroHeadline' => 'Edited from the admin'])
            ->call('save')
            ->assertHasNoFormErrors();

        $content = $home->fresh()->content;
        $this->assertSame('Edited from the admin', $content['heroHeadline']);
        $this->assertSame("What I'm working on", $content['focusHeading']);
        $this->assertCount(3, $content['focusItems']);
    }

    public function test_creating_and_publishing_an_article(): void
    {
        Livewire::test(CreateArticle::class)
            ->fillForm([
                'title' => 'A new essay',
                'slug' => 'a-new-essay',
                'excerpt' => 'Short summary.',
                'body' => '<h2>Start</h2><p>Words.</p>',
                'status' => 'published',
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $article = Article::query()->where('slug', 'a-new-essay')->first();
        $this->assertTrue($article->isLive());
        $this->getJson('/api/articles/a-new-essay')->assertOk();
    }

    public function test_site_settings_save(): void
    {
        Livewire::test(ManageSiteSettings::class)
            ->fillForm(['linkedin_url' => 'https://www.linkedin.com/in/example'])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertSame('https://www.linkedin.com/in/example', SiteSetting::current()->linkedin_url);
    }
}
