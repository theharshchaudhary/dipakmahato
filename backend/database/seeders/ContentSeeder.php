<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\Venture;
use Illuminate\Database\Seeder;

/**
 * Starting content, carried over from the original static site. Every value is
 * editable in the admin panel; placeholders are marked as such.
 */
class ContentSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::query()->firstOrCreate([], [
            'full_name' => 'Dipak Kumar Mahato',
            'short_name' => 'Dipak Mahato',
            'alternate_names' => ['Dipak Mahato'],
            'job_title' => 'CEO',
            'organization_name' => 'Zedfo',
            'organization_url' => null,
            'positioning' => 'Entrepreneur building businesses in Nepal and learning through execution.',
            'location' => 'Nepal',
            'email' => 'hello@example.com',
            'linkedin_url' => null,
            'same_as' => [],
            'site_url' => env('FRONTEND_URL', 'http://localhost:8080'),
        ]);

        $this->pages();
        $this->ventures();
        $this->articles();
    }

    private function pages(): void
    {
        $pages = [
            'home' => [
                'nav_label' => 'Home',
                'show_in_nav' => false,
                'nav_order' => 0,
                'meta_title' => 'Dipak Kumar Mahato — Entrepreneur, CEO of Zedfo',
                'meta_description' => 'Dipak Kumar Mahato (Dipak Mahato) is an entrepreneur and CEO of Zedfo, building businesses in Nepal and writing about business, technology and execution.',
                'content' => [
                    'heroHeadline' => 'Building useful businesses in Nepal.',
                    'heroLead' => "As CEO of Zedfo, I'm working to make everyday commerce more convenient. I start from real problems, make careful decisions, and write down what I learn.",
                    'primaryCtaLabel' => "See what I'm building",
                    'secondaryCtaLabel' => 'About me',
                    'focusHeading' => "What I'm working on",
                    'focusItems' => [
                        ['title' => 'Zedfo', 'body' => 'Building a local commerce business, where customer experience, operations, and technology meet.', 'ctaLabel' => 'See the venture', 'page' => 'ventures', 'tone' => 'sign'],
                        ['title' => 'Writing', 'body' => 'Notes on business decisions, lessons from building, and what execution actually takes.', 'ctaLabel' => 'Read the essays', 'page' => 'writing', 'tone' => 'crimson'],
                        ['title' => 'Partnerships', 'body' => 'Meeting people who build useful products, businesses, and communities.', 'ctaLabel' => 'Get in touch', 'page' => 'contact', 'tone' => 'marigold'],
                    ],
                    'writingHeading' => 'Recent writing',
                    'spotlightBody' => 'Zedfo is the company Dipak leads as CEO. A verified description, product imagery, and a link to the official site will be added here.',
                    'spotlightCtaLabel' => 'Read about Zedfo',
                    'ctaTitle' => 'Good businesses are built one decision at a time.',
                    'ctaBody' => "I'm glad to talk about entrepreneurship, technology, and building useful things.",
                    'ctaLabel' => 'Start a conversation',
                ],
            ],
            'about' => [
                'nav_label' => 'About',
                'nav_order' => 1,
                'meta_title' => 'About Dipak Kumar Mahato',
                'meta_description' => 'Background, journey and leadership philosophy of Dipak Kumar Mahato, entrepreneur and CEO of Zedfo.',
                'content' => [
                    'lead' => 'I build businesses by understanding problems first, then turning ideas into practical solutions. I care most about where business, technology, and execution meet.',
                    'note' => 'Biographical details below are placeholders until verified with Dipak.',
                    'sections' => [
                        ['title' => 'How I got here', 'body' => 'Placeholder, to be written from a founder interview: how Dipak came to entrepreneurship, the first steps taken, and what led to Zedfo.'],
                        ['title' => 'Background', 'body' => 'Placeholder: verified education and professional history will be added here. Nothing has been assumed.'],
                        ['title' => 'How I lead', 'body' => 'Meaningful progress comes from understanding real problems, making thoughtful decisions, and learning from what happens in practice. Proposed copy, to be refined with Dipak.'],
                        ['title' => 'Right now', 'body' => 'Leading Zedfo as CEO, working to make everyday commerce in Nepal more convenient, and writing about the lessons along the way.'],
                    ],
                    'interestsHeading' => 'What I think about',
                    'interests' => ['Entrepreneurship', 'Local commerce', 'Operations', 'Technology for real problems', 'Decision-making'],
                    'ctaTitle' => "Let's start a conversation.",
                    'ctaBody' => "Partnerships, collaboration, or an exchange of ideas — I'd be glad to hear from you.",
                    'ctaLabel' => 'Get in touch',
                ],
            ],
            'writing' => [
                'nav_label' => 'Writing',
                'nav_order' => 2,
                'meta_title' => 'Writing — Dipak Kumar Mahato',
                'meta_description' => 'Essays by Dipak Kumar Mahato on entrepreneurship, business strategy, technology and building companies in Nepal.',
                'content' => [
                    'heading' => 'Writing',
                    'lead' => 'Notes on business decisions, lessons from building, and the hard parts of execution.',
                    'emptyMessage' => 'The first essays are being written. Check back soon.',
                ],
            ],
            'ventures' => [
                'nav_label' => 'Ventures',
                'nav_order' => 3,
                'meta_title' => 'Ventures — Dipak Kumar Mahato',
                'meta_description' => 'Ventures led by Dipak Kumar Mahato, including Zedfo — building more convenient access to local commerce in Nepal.',
                'content' => [
                    'heading' => 'Ventures',
                    'lead' => 'The businesses I lead and contribute to: what they do, and the problems they set out to solve.',
                    'note' => 'Company details are placeholders until verified. No metrics are assumed.',
                    'ctaTitle' => 'Building something useful?',
                    'ctaBody' => "I'm open to conversations with partners, collaborators, and people solving real problems.",
                    'ctaLabel' => 'Get in touch',
                ],
            ],
            'contact' => [
                'nav_label' => 'Contact',
                'nav_order' => 4,
                'meta_title' => 'Contact Dipak Kumar Mahato',
                'meta_description' => 'Get in touch with Dipak Kumar Mahato about partnerships, media, speaking or collaboration.',
                'content' => [
                    'heading' => "Let's talk.",
                    'lead' => 'Write to me directly, or send a message with the form.',
                    'inquiries' => [
                        ['title' => 'Business partnerships', 'body' => 'Working together on commerce, operations, or technology.'],
                        ['title' => 'Media and speaking', 'body' => 'Interviews, panels, and talks on entrepreneurship in Nepal.'],
                        ['title' => 'Collaboration', 'body' => 'Projects, ideas, and communities building useful things.'],
                    ],
                    'successMessage' => "Message sent. I'll reply to the email address you gave.",
                ],
            ],
        ];

        foreach ($pages as $key => $attributes) {
            Page::query()->firstOrCreate(['key' => $key], $attributes);
        }
    }

    private function ventures(): void
    {
        Venture::query()->firstOrCreate(['slug' => 'zedfo'], [
            'name' => 'Zedfo',
            'tagline' => 'Building more convenient access to local commerce.',
            'role' => 'Chief Executive Officer',
            'description' => 'Zedfo is the current venture led by Dipak. A verified company description will be added here — what Zedfo offers, who it serves, and where it operates.',
            'problem' => "Placeholder: describe the everyday commerce problem Zedfo addresses for customers and local businesses, in Zedfo's own verified words.",
            'product' => 'Placeholder: an overview of the product experience — how customers use Zedfo and how it connects them with local commerce. Product screenshots will appear alongside.',
            'milestones' => [],
            'is_primary' => true,
        ]);
    }

    private function articles(): void
    {
        $categories = collect(['Entrepreneurship', 'Business Strategy', 'Technology', 'Founder Reflections'])
            ->mapWithKeys(fn (string $name, int $i) => [$name => Category::query()->firstOrCreate(
                ['slug' => str($name)->slug()->toString()],
                ['name' => $name, 'sort' => $i],
            )->id]);

        $body = fn (string $topic) => <<<HTML
            <h2>The context</h2>
            <p>Draft placeholder. This section will introduce {$topic} and why it matters to someone building a business today.</p>
            <p>Final copy will be written by Dipak. Until then, this text exists only to preview the reading experience: line length, rhythm, and hierarchy.</p>
            <h2>What I observed</h2>
            <p>Draft placeholder for first-hand observations. Real examples and lessons will replace this paragraph once the article is written.</p>
            <h2>What I would do differently</h2>
            <p>Draft placeholder for reflections and practical takeaways.</p>
            <h2>Closing thought</h2>
            <p>Draft placeholder for a short closing reflection.</p>
            HTML;

        // All drafts: they stay off the public site until finished and published in the admin.
        $articles = [
            ['before-building-a-startup-in-nepal', 'What I Wish I Had Understood Before Building a Startup in Nepal', 'Notes on the gap between planning a business and actually running one.', 'The lessons that only show up once you start — about customers, operations, and patience.', 'Founder Reflections', 'the realities of starting a company in Nepal', true],
            ['more-orders-better-business', "Why More Orders Don't Automatically Mean a Better Business", 'Growth, unit economics, and the quiet cost of scale.', 'Volume can hide problems. A look at what actually makes each order worth fulfilling.', 'Business Strategy', 'the relationship between growth and business quality', false],
            ['technology-and-local-businesses', 'Where Technology Can Actually Help Local Businesses', 'Separating useful tools from technology for its own sake.', 'Not every problem needs an app. Thinking about where software genuinely earns its place.', 'Technology', 'practical technology for local businesses', false],
            ['decisions-under-uncertainty', "Making Decisions When You Don't Have Enough Information", 'A working approach to moving forward without certainty.', 'Most early decisions are made with incomplete data. How to make them anyway.', 'Entrepreneurship', 'decision-making under uncertainty', false],
            ['operations-is-the-product', 'In Local Commerce, Operations Is the Product', 'Why the customer experience is built behind the scenes.', 'Customers rarely see operations — but they feel every part of it.', 'Business Strategy', 'operations as a customer experience', false],
            ['learning-through-execution', 'Learning Through Execution', 'Why doing teaches what planning cannot.', 'Some lessons are only available to people who ship.', 'Entrepreneurship', 'learning by doing', false],
            ['hiring-early-team', 'Notes on Building an Early Team', 'Placeholder reflections on hiring and trust.', 'Draft thoughts on finding people who care about the problem.', 'Founder Reflections', 'building an early team', false],
        ];

        foreach ($articles as [$slug, $title, $subtitle, $excerpt, $category, $topic, $featured]) {
            Article::query()->firstOrCreate(['slug' => $slug], [
                'title' => $title,
                'subtitle' => $subtitle,
                'excerpt' => $excerpt,
                'category_id' => $categories[$category],
                'body' => $body($topic),
                'status' => 'draft',
                'featured' => $featured,
            ]);
        }
    }
}
