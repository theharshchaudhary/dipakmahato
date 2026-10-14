<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\Venture;
use App\Support\HomeHeroDefaults;
use Illuminate\Database\Seeder;

/**
 * Starting content for the site. Facts about Zedfo come from zedfo.com;
 * personal details from Dipak's public profiles. Everything is editable in
 * the admin panel, and essays start as drafts for Dipak to review.
 */
class ContentSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::query()->firstOrCreate([], [
            ...self::siteSettings(),
            'site_url' => env('FRONTEND_URL', 'http://localhost:8080'),
        ]);

        foreach (self::pages() as $key => $attributes) {
            Page::query()->firstOrCreate(['key' => $key], $attributes);
        }

        Venture::query()->firstOrCreate(['slug' => 'zedfo'], self::zedfo());

        $categories = self::categories();
        foreach (self::essays() as $essay) {
            Article::query()->firstOrCreate(['slug' => $essay['slug']], [
                ...collect($essay)->except(['slug', 'category'])->all(),
                'category_id' => $categories[$essay['category']],
                'status' => 'draft',
            ]);
        }
    }

    public static function siteSettings(): array
    {
        return [
            'full_name' => 'Dipak Kumar Mahato',
            'short_name' => 'Dipak Mahato',
            'alternate_names' => ['Dipak Mahato', 'Dipak K. Mahato'],
            'job_title' => 'CEO & Co-founder',
            'organization_name' => 'Zedfo',
            'organization_url' => 'https://zedfo.com',
            'positioning' => 'CEO & co-founder of Zedfo, building a fair, all-in-one delivery platform for the Kathmandu Valley.',
            'location' => 'Kathmandu, Nepal',
            'email' => 'dipakkumarmahato553@gmail.com',
            'linkedin_url' => null,
            'same_as' => [
                'https://www.facebook.com/dipak.kumar.mahato.818628',
                'https://www.instagram.com/dipak_mahato01',
                'https://www.tiktok.com/@dipak_kumar06',
            ],
        ];
    }

    /** @return array<string, int> category name => id */
    private static function categories(): array
    {
        return collect(['Entrepreneurship', 'Business Strategy', 'Technology', 'Founder Reflections'])
            ->mapWithKeys(fn (string $name, int $i) => [$name => Category::query()->firstOrCreate(
                ['slug' => str($name)->slug()->toString()],
                ['name' => $name, 'sort' => $i],
            )->id])
            ->all();
    }

    public static function pages(): array
    {
        return [
            'home' => [
                'nav_label' => 'Home',
                'show_in_nav' => false,
                'nav_order' => 0,
                'meta_title' => 'Dipak Kumar Mahato — CEO & Co-founder of Zedfo',
                'meta_description' => 'Dipak Kumar Mahato (Dipak Mahato) is the CEO and co-founder of Zedfo, the all-in-one delivery app for the Kathmandu Valley, with restaurant menu prices.',
                'content' => self::homeContent(),
            ],
            'about' => [
                'nav_label' => 'About',
                'nav_order' => 1,
                'meta_title' => 'About Dipak Kumar Mahato',
                'meta_description' => 'Dipak Kumar Mahato is a Kathmandu-based entrepreneur, CEO and co-founder of Zedfo — building fair, transparent delivery for Nepal.',
                'content' => self::aboutContent(),
            ],
            'writing' => [
                'nav_label' => 'Writing',
                'nav_order' => 2,
                'meta_title' => 'Writing — Dipak Kumar Mahato',
                'meta_description' => 'Essays by Dipak Kumar Mahato on fair pricing, local commerce, and building a startup in Nepal.',
                'content' => [
                    'heading' => 'Writing',
                    'lead' => 'Notes from building Zedfo: fair pricing, local commerce, and what it takes to build a company in Nepal.',
                    'note' => null,
                    'emptyMessage' => 'The first essays are on their way. Follow along on Instagram in the meantime.',
                ],
            ],
            'ventures' => [
                'nav_label' => 'Ventures',
                'nav_order' => 3,
                'meta_title' => 'Zedfo — Ventures of Dipak Kumar Mahato',
                'meta_description' => "Zedfo, led by Dipak Kumar Mahato: food delivery across the Kathmandu Valley at the restaurant's own menu price, plus essentials, grocery and medicine in one app.",
                'content' => [
                    'heading' => 'Ventures',
                    'lead' => 'What I\'m building, and the problem it sets out to solve.',
                    'note' => null,
                    'ctaTitle' => 'Run a restaurant or local business?',
                    'ctaBody' => 'Zedfo partners with restaurants, stores and suppliers across the Kathmandu Valley. Let\'s talk about working together.',
                    'ctaLabel' => 'Get in touch',
                ],
            ],
            'contact' => [
                'nav_label' => 'Contact',
                'nav_order' => 4,
                'meta_title' => 'Contact Dipak Kumar Mahato',
                'meta_description' => 'Get in touch with Dipak Kumar Mahato, CEO of Zedfo, about restaurant and business partnerships, media, podcasts and collaboration.',
                'content' => [
                    'heading' => "Let's talk.",
                    'lead' => 'Write to me directly, or send a message with the form.',
                    'inquiries' => [
                        ['title' => 'Restaurant and business partners', 'body' => 'Bring your restaurant or store onto Zedfo, or explore food packages, B2B supply and dine-out partnerships.'],
                        ['title' => 'Media and podcasts', 'body' => 'Interviews, panels and conversations about startups, delivery and fair pricing in Nepal.'],
                        ['title' => 'Collaboration', 'body' => 'Creators, communities and builders who want a fairer local economy.'],
                    ],
                    'successMessage' => "Message sent. I'll reply to the email address you gave.",
                ],
            ],
        ];
    }

    public static function homeContent(): array
    {
        return [
            ...HomeHeroDefaults::CONTENT,
            'heroKeywords' => [],
            'heroHandle' => '@dipak_mahato01',
            'heroGreeting' => "Hi, I'm",
            'heroIntro' => 'CEO & co-founder of Zedfo Now Pvt. Ltd.',
            'heroQuestion' => null,
            'primaryCtaLabel' => "See what I'm building",
            'secondaryCtaLabel' => 'About me',
            'focusHeading' => "What I'm working on",
            'focusItems' => [
                ['title' => 'Zedfo', 'body' => 'Nepal\'s all-in-one delivery app, starting with food across the Kathmandu Valley — at the same menu price set by the restaurant.', 'ctaLabel' => 'See the venture', 'page' => 'ventures', 'tone' => 'sign'],
                ['title' => 'Fair delivery', 'body' => 'No inflated menu prices and no hidden charges. Notes on why pricing honesty matters, and what it takes to keep it.', 'ctaLabel' => 'Read the essays', 'page' => 'writing', 'tone' => 'crimson'],
                ['title' => 'Partners', 'body' => 'Working with restaurants, stores, riders and creators who want a fairer local economy.', 'ctaLabel' => 'Get in touch', 'page' => 'contact', 'tone' => 'marigold'],
            ],
            'writingHeading' => 'Recent writing',
            'spotlightBody' => 'Zedfo is starting with food delivery in the Kathmandu Valley, with daily essentials, grocery, medicine and fashion in the same app. Food comes at the restaurant\'s own menu price — no inflated prices, no hidden charges.',
            'spotlightCtaLabel' => 'Read about Zedfo',
            'ctaTitle' => 'Good businesses are built one decision at a time.',
            'ctaBody' => "I'm glad to talk about startups, local commerce, and building fairer platforms in Nepal.",
            'ctaLabel' => 'Start a conversation',
        ];
    }

    public static function aboutContent(): array
    {
        return [
            'lead' => "I'm building Zedfo in Kathmandu because I believe Nepal deserves platforms that are fair to the people who use them: honest prices for customers, workable terms for local businesses.",
            'note' => null,
            'sections' => [
                ['title' => 'How I got here', 'body' => "Before Zedfo, my work was in operations and administration — the unglamorous side of business where you see exactly where money and time leak away. I'm also completing a Master of Business Studies at Nepal Commerce Campus. Both pointed me to the same conclusion: the most useful thing I could do was build something here, for here."],
                ['title' => 'Why Zedfo', 'body' => "Ordering food online in Nepal often costs more than walking into the same restaurant. Zedfo starts from the opposite idea: food at the restaurant's own menu price, delivery charges shown plainly, nothing hidden. I call it a fair delivery movement rather than just another app."],
                ['title' => 'How I lead', 'body' => "Be transparent with customers, partners and the team. Make the economics work for restaurants and riders, not only for the platform. Ship, listen, and fix what doesn't work."],
                ['title' => 'Right now', 'body' => 'Growing food delivery across the Kathmandu Valley, bringing more restaurants and stores onto Zedfo, and expanding the app into essentials, grocery and medicine.'],
            ],
            'interestsHeading' => 'What I think about',
            'interests' => ['Fair pricing', 'Hyper-local delivery', 'Local commerce', 'Operations', 'Startups in Nepal'],
            'ctaTitle' => "Let's start a conversation.",
            'ctaBody' => "Partnerships, media, or an exchange of ideas — I'd be glad to hear from you.",
            'ctaLabel' => 'Get in touch',
        ];
    }

    public static function zedfo(): array
    {
        return [
            'name' => 'Zedfo',
            'tagline' => "Nepal's all-in-one delivery app — at the restaurant's own menu price.",
            'role' => 'CEO & Co-founder',
            'description' => "Zedfo is an all-in-one delivery app built in Nepal, starting with food delivery across the Kathmandu Valley. Customers can also order daily essentials, grocery, medicine and fashion from the same app, with home services coming soon.",
            'problem' => "Food ordered through delivery apps often costs more than the same dish at the restaurant, and the real total only appears at checkout. Customers pay more than they expect, and trust in ordering online wears thin.",
            'product' => "Zedfo delivers food at the same menu price set by the restaurant — no inflated menu prices, no hidden charges. For partners there are restaurant delivery, food packages, B2B supply and dine-out programs, with store tools for inventory, payments and an earnings dashboard. Riders get route optimisation, real-time tracking and their own earnings dashboard.",
            'milestones' => [
                'Launched food delivery across the Kathmandu Valley',
                'Available on the App Store and Google Play',
            ],
            'website_url' => 'https://zedfo.com',
            'is_primary' => true,
        ];
    }

    /** Draft essays grounded in Zedfo's published positions, for Dipak to review, edit and publish. */
    public static function essays(): array
    {
        return [
            [
                'slug' => 'same-menu-price',
                'title' => 'Same Menu Price: Why Zedfo Doesn\'t Mark Up Your Food',
                'subtitle' => 'Fair delivery starts with the number on the menu.',
                'excerpt' => 'Ordering online shouldn\'t cost more than walking into the restaurant. Why we chose the restaurant\'s own menu price — and what that commits us to.',
                'category' => 'Business Strategy',
                'featured' => true,
                'body' => <<<'HTML'
                    <h2>The hidden gap</h2>
                    <p>Most people in Kathmandu have noticed it: the same momo plate costs more in a delivery app than on the restaurant's own menu. The difference is rarely explained. It is simply built into the price, and the delivery fee comes on top.</p>
                    <p>That gap teaches customers that ordering online means paying a premium they cannot see. Over time it erodes trust — in the app, and sometimes in the restaurant too.</p>
                    <h2>The rule we chose</h2>
                    <p>On Zedfo, food is listed at the same menu price set by the restaurant. No inflated menu prices. No hidden charges. What you pay for delivery is shown as delivery, not folded into the food.</p>
                    <p>It sounds simple. It is also a constraint we accepted on purpose, because it forces the platform to earn its keep honestly rather than quietly.</p>
                    <h2>What it commits us to</h2>
                    <p>Keeping prices honest means our operations have to be efficient: smart routing, good tools for restaurants, and a delivery fee that reflects real costs. If the model only works by marking up food, the model is wrong.</p>
                    <h2>Why it matters</h2>
                    <p>Fair pricing is the first promise of what I call the fair delivery movement. Customers should be able to trust the number they see. Restaurants should not have to choose between their walk-in prices and their online prices. That is the platform Nepal deserves.</p>
                    HTML,
            ],
            [
                'slug' => 'built-in-nepal-for-nepal',
                'title' => 'Built in Nepal, for Nepal',
                'subtitle' => 'Why I chose to build a delivery platform here.',
                'excerpt' => 'Nepal\'s cities, businesses and customers have their own needs. Notes on building a product for them, from here.',
                'category' => 'Founder Reflections',
                'featured' => false,
                'body' => <<<'HTML'
                    <h2>A local problem</h2>
                    <p>Delivery in the Kathmandu Valley has its own realities: narrow streets, scattered addresses, small family-run restaurants, and customers who compare every price. Products designed elsewhere tend to treat those as edge cases. Here, they are the whole case.</p>
                    <h2>Building close to it</h2>
                    <p>Being here means we hear from restaurant owners, riders and customers directly. When a menu is wrong or a delivery is late, the feedback is a conversation, not a ticket. That closeness is an advantage I want to keep as Zedfo grows.</p>
                    <h2>More than food</h2>
                    <p>Food is where Zedfo starts. The same app already carries daily essentials, grocery, medicine and fashion, with home services to come. The goal is one honest place to get what you need, delivered by people from your own city.</p>
                    <h2>What I hope it proves</h2>
                    <p>That a Nepali team can build a platform people here prefer — not because it is local, but because it is fairer and works better for them.</p>
                    HTML,
            ],
            [
                'slug' => 'what-restaurants-need-from-delivery',
                'title' => 'What Local Restaurants Actually Need from a Delivery Platform',
                'subtitle' => 'Orders matter. So do fair terms, good tools and getting paid.',
                'excerpt' => 'A delivery platform should make a restaurant\'s business stronger, not thinner. What we focus on for Zedfo\'s partners.',
                'category' => 'Entrepreneurship',
                'featured' => false,
                'body' => <<<'HTML'
                    <h2>Start with their economics</h2>
                    <p>For a small restaurant, every rupee of margin counts. A platform that brings orders but squeezes the business is not a partner; it is a toll. Fair delivery has to work for the kitchen as well as the customer.</p>
                    <h2>Tools, not just traffic</h2>
                    <p>Restaurants and stores on Zedfo get tools to manage inventory, take payments and withdraw earnings, with a dashboard that shows what they have earned. The point is to help a business run better, not only to send it more orders.</p>
                    <h2>More than one way to work together</h2>
                    <p>Not every business needs the same thing. Alongside restaurant delivery, Zedfo offers food packages, B2B supply and dine-out partnerships, so a partner can choose what fits.</p>
                    <h2>Trust is the product</h2>
                    <p>When customers see the restaurant's real menu price, they trust the restaurant more. That trust is worth more than any short-term markup — for the restaurant, and for us.</p>
                    HTML,
            ],
        ];
    }
}
