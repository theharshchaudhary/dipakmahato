<?php

namespace Tests\Feature;

use App\Filament\Pages\ManageAppearance;
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
use Illuminate\Support\Facades\Storage;
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
            '/admin/users', '/admin/manage-site-settings', '/admin/appearance',
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
            ->fillForm(['content.heroQuestion' => 'Edited from the admin'])
            ->call('save')
            ->assertHasNoFormErrors();

        $content = $home->fresh()->content;
        $this->assertSame('Edited from the admin', $content['heroQuestion']);
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

    public function test_hero_text_is_optional(): void
    {
        $home = Page::query()->where('key', 'home')->first();

        Livewire::test(EditPage::class, ['record' => $home->getRouteKey()])
            ->fillForm(['content.heroIntro' => null, 'content.heroQuestion' => null, 'content.heroGreeting' => null])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertNull($home->fresh()->content['heroQuestion']);
    }

    public function test_appearance_saves_colours_fonts_and_css(): void
    {
        Livewire::test(ManageAppearance::class)
            ->fillForm([
                'theme.light.button' => '#112233',
                'theme.serifFont' => 'fraunces',
                'theme.darkMode' => 'off',
                'custom_css' => 'body { letter-spacing: 0; }',
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->getJson('/api/site')
            ->assertJsonPath('theme.light.button', '#112233')
            ->assertJsonPath('theme.light.background', '#f3f4f8')
            ->assertJsonPath('theme.serifFont', 'fraunces')
            ->assertJsonPath('theme.darkMode', 'off')
            ->assertJsonPath('customCss', 'body { letter-spacing: 0; }');
    }

    public function test_appearance_rejects_invalid_colours(): void
    {
        Livewire::test(ManageAppearance::class)
            ->fillForm(['theme.light.text' => 'red; } body { display:none'])
            ->call('save')
            ->assertHasFormErrors(['theme.light.text']);
    }

    public function test_saving_settings_keeps_an_uploaded_portrait(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('site/me.png', 'png');
        SiteSetting::current()->update(['portrait_path' => 'site/me.png']);

        Livewire::test(ManageSiteSettings::class)
            ->fillForm(['job_title' => 'Founder'])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertSame('site/me.png', SiteSetting::current()->portrait_path);
    }
}
