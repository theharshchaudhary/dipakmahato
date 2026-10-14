<?php

namespace App\Filament\Resources\Pages\Schemas;

use App\Models\Page;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;

class PageForm
{
    public const TONES = [
        'sign' => 'Blue (ventures)',
        'crimson' => 'Red (writing)',
        'marigold' => 'Marigold (contact)',
        'ink' => 'Ink (about)',
    ];

    public const LINK_TARGETS = [
        'about' => 'About',
        'writing' => 'Writing',
        'ventures' => 'Ventures',
        'contact' => 'Contact',
    ];

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Tabs::make()->persistTabInQueryString()->tabs([
                    Tab::make('Content')->schema(fn (?Page $record) => self::content($record?->key)),
                    Tab::make('Search & sharing')->schema([
                        TextInput::make('meta_title')
                            ->label('Page title in Google')
                            ->maxLength(70)
                            ->helperText('Aim for 50–60 characters and include the full name.'),
                        Textarea::make('meta_description')
                            ->label('Description in Google')
                            ->rows(3)
                            ->maxLength(170)
                            ->helperText('120–160 characters. Say plainly what this page offers.'),
                        FileUpload::make('og_image_path')
                            ->label('Share image')
                            ->image()->disk('public')->directory('pages')
                            ->helperText('Shown when the page is shared on LinkedIn, WhatsApp, etc. 1200 × 630.'),
                    ]),
                    Tab::make('Navigation')->schema([
                        TextInput::make('nav_label')->label('Menu label')->required()->maxLength(30),
                        Toggle::make('show_in_nav')->label('Show in menu'),
                        TextInput::make('nav_order')->label('Menu position')->numeric()->minValue(0),
                    ]),
                ]),
            ]);
    }

    /** Content fields differ per page; each maps to what that page renders. */
    private static function content(?string $key): array
    {
        return match ($key) {
            'home' => [
                Section::make('Hero')
                    ->description('Reads as one sentence: greeting + name and the intro on the left, the question on the right. The photo is the portrait in Site settings — a cut-out PNG with a transparent background looks best.')
                    ->columns(2)
                    ->schema([
                        TagsInput::make('content.heroKeywords')
                            ->label('Words across the top')
                            ->helperText('Up to three, e.g. Leadership, Strategy, Vision.')
                            ->rules(['max:3'])
                            ->columnSpanFull(),
                        TextInput::make('content.heroGreeting')
                            ->label('Greeting before the name')
                            ->required()->maxLength(40)
                            ->helperText('The full name from Site settings follows it.'),
                        TextInput::make('content.heroHandle')
                            ->label('Badge text')
                            ->maxLength(40)
                            ->helperText('Shown beside the small photo, e.g. a social handle. Empty shows the job title.'),
                        Textarea::make('content.heroIntro')->label('Intro (left)')->rows(2)->required()->maxLength(140),
                        Textarea::make('content.heroQuestion')->label('Question (right)')->rows(2)->required()->maxLength(80),
                        TextInput::make('content.heroMonogram')->label('Monogram')->required()->maxLength(3),
                        TextInput::make('content.heroSignature')->label('Signature name')->required()->maxLength(40),
                        TextInput::make('content.heroSignatureNote')->label('Signature second line')->maxLength(40),
                        TextInput::make('content.primaryCtaLabel')->label('Main button (goes to Ventures)')->required(),
                        TextInput::make('content.secondaryCtaLabel')->label('Second button (goes to About)')->required(),
                    ]),
                Section::make("What I'm working on")->schema([
                    TextInput::make('content.focusHeading')->label('Heading')->required(),
                    Repeater::make('content.focusItems')
                        ->label('Items')
                        ->schema([
                            TextInput::make('title')->required(),
                            Textarea::make('body')->rows(2)->required(),
                            TextInput::make('ctaLabel')->label('Link text')->required(),
                            Select::make('page')->label('Links to')->options(self::LINK_TARGETS)->required(),
                            Select::make('tone')->label('Colour')->options(self::TONES)->required(),
                        ])
                        ->columns(2)
                        ->maxItems(6)
                        ->collapsible()
                        ->itemLabel(fn (array $state) => $state['title'] ?? null),
                ]),
                Section::make('Recent writing and venture spotlight')->schema([
                    TextInput::make('content.writingHeading')->label('Writing heading')->required(),
                    Textarea::make('content.spotlightBody')->label('Venture spotlight text')->rows(3),
                    TextInput::make('content.spotlightCtaLabel')->label('Venture spotlight button'),
                ]),
                self::ctaSection(),
            ],
            'about' => [
                Section::make('Introduction')->schema([
                    Textarea::make('content.lead')->label('Introduction')->rows(3)->required(),
                    self::noteField(),
                ]),
                Section::make('Story')->schema([
                    Repeater::make('content.sections')
                        ->label('Sections')
                        ->schema([
                            TextInput::make('title')->required(),
                            Textarea::make('body')->rows(4)->required(),
                        ])
                        ->reorderable()
                        ->collapsible()
                        ->itemLabel(fn (array $state) => $state['title'] ?? null),
                    TextInput::make('content.interestsHeading')->label('Interests heading'),
                    TagsInput::make('content.interests')->label('Interests'),
                ]),
                self::ctaSection(),
            ],
            'writing' => [
                Section::make('Header')->schema([
                    TextInput::make('content.heading')->label('Heading')->required(),
                    Textarea::make('content.lead')->label('Introduction')->rows(2),
                    self::noteField(),
                    TextInput::make('content.emptyMessage')
                        ->label('Message when no essays are published')
                        ->required(),
                ]),
            ],
            'ventures' => [
                Section::make('Header')->schema([
                    TextInput::make('content.heading')->label('Heading')->required(),
                    Textarea::make('content.lead')->label('Introduction')->rows(2),
                    self::noteField(),
                ]),
                self::ctaSection(),
            ],
            'contact' => [
                Section::make('Header')->schema([
                    TextInput::make('content.heading')->label('Heading')->required(),
                    Textarea::make('content.lead')->label('Introduction')->rows(2),
                ]),
                Section::make('Reasons to get in touch')->schema([
                    Repeater::make('content.inquiries')
                        ->hiddenLabel()
                        ->schema([
                            TextInput::make('title')->required(),
                            Textarea::make('body')->rows(2)->required(),
                        ])
                        ->reorderable()
                        ->collapsible()
                        ->itemLabel(fn (array $state) => $state['title'] ?? null),
                ]),
                Section::make('Form')->schema([
                    TextInput::make('content.successMessage')
                        ->label('Message shown after sending')
                        ->required(),
                ]),
            ],
            default => [],
        };
    }

    private static function noteField(): Textarea
    {
        return Textarea::make('content.note')
            ->label('Draft note')
            ->rows(2)
            ->helperText('Optional highlighted note, e.g. to flag placeholder content. Leave empty to hide it.');
    }

    private static function ctaSection(): Section
    {
        return Section::make('Closing call to action')
            ->description('The marigold band at the bottom of the page. The button goes to Contact.')
            ->schema([
                TextInput::make('content.ctaTitle')->label('Title')->required(),
                Textarea::make('content.ctaBody')->label('Text')->rows(2),
                TextInput::make('content.ctaLabel')->label('Button')->required(),
            ]);
    }
}
