<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use BackedEnum;
use UnitEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class ManageSiteSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static string|UnitEnum|null $navigationGroup = 'Settings';

    protected static ?string $navigationLabel = 'Site settings';

    protected static ?string $title = 'Site settings';

    protected static ?int $navigationSort = 1;

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill(SiteSetting::current()->attributesToArray());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->model(SiteSetting::current())
            ->statePath('data')
            ->components([
                Section::make('Identity')
                    ->description('Who the site is about. Used in the header, footer and Google\'s understanding of the person.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('full_name')->required()->maxLength(120),
                        TextInput::make('short_name')->label('Short name (header)')->required()->maxLength(60),
                        TagsInput::make('alternate_names')
                            ->label('Other names people search for')
                            ->helperText('E.g. "Dipak Mahato". Helps Google connect searches to this site.')
                            ->columnSpanFull(),
                        TextInput::make('job_title')->required()->maxLength(120),
                        TextInput::make('location')->maxLength(120),
                        TextInput::make('organization_name')->label('Company')->maxLength(120),
                        TextInput::make('organization_url')->label('Company website')->url()->maxLength(255),
                        Textarea::make('positioning')
                            ->label('One-line description (footer)')
                            ->required()->rows(2)->maxLength(255)->columnSpanFull(),
                        FileUpload::make('portrait_path')
                            ->label('Portrait')
                            ->image()->imageEditor()->disk('public')->directory('site')
                            ->helperText('Shown on the home and about pages. Portrait orientation, at least 800 × 1000.')
                            ->columnSpanFull(),
                    ]),
                Section::make('Contact and profiles')
                    ->columns(2)
                    ->schema([
                        TextInput::make('email')->email()->required()
                            ->helperText('Shown publicly, and where contact-form notifications are sent.'),
                        TextInput::make('linkedin_url')->label('LinkedIn URL')->url()->maxLength(255),
                        TagsInput::make('same_as')
                            ->label('Other official profiles')
                            ->helperText('Full URLs (X, Facebook, Instagram, Crunchbase, company bio…). Linking them tells Google these profiles are the same person.')
                            ->columnSpanFull(),
                    ]),
                Section::make('Search engines')
                    ->columns(2)
                    ->schema([
                        TextInput::make('site_url')
                            ->label('Public site URL')
                            ->url()->required()
                            ->helperText('The live address, e.g. https://dipakmahato.com. Used for canonical links and the sitemap.')
                            ->columnSpanFull(),
                        TextInput::make('google_site_verification')
                            ->label('Google Search Console code')
                            ->helperText('Only the content="…" value of the HTML tag.'),
                        TextInput::make('bing_site_verification')->label('Bing Webmaster code'),
                        FileUpload::make('default_og_image_path')
                            ->label('Default share image')
                            ->image()->disk('public')->directory('site')
                            ->helperText('Used when a page has no image of its own. 1200 × 630.')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public function content(Schema $schema): Schema
    {
        return $schema->components([
            Form::make([EmbeddedSchema::make('form')])
                ->id('form')
                ->livewireSubmitHandler('save')
                ->footer([
                    Actions::make([
                        Action::make('save')->label('Save settings')->submit('save')->keyBindings(['mod+s']),
                    ])->key('form-actions'),
                ]),
        ]);
    }

    public function save(): void
    {
        SiteSetting::current()->update($this->form->getState());

        Notification::make()->success()->title('Settings saved')->send();
    }
}
