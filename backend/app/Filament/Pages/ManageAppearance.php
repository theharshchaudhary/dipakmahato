<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use App\Support\ThemeDefaults;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\CodeEditor;
use Filament\Forms\Components\CodeEditor\Enums\Language;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\ToggleButtons;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

/** Colours, fonts, branding and custom CSS for the public site. */
class ManageAppearance extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSwatch;

    protected static string|UnitEnum|null $navigationGroup = 'Design';

    protected static ?string $navigationLabel = 'Appearance';

    protected static ?string $title = 'Appearance';

    protected static ?string $slug = 'appearance';

    protected static ?int $navigationSort = 1;

    public ?array $data = [];

    public function mount(): void
    {
        $settings = SiteSetting::current();
        $this->form->fill([
            'theme' => $settings->resolvedTheme(),
            'logo_path' => $settings->logo_path,
            'favicon_path' => $settings->favicon_path,
            'footer_note' => $settings->footer_note,
            'custom_css' => $settings->custom_css,
        ]);
    }

    public function getSubheading(): ?string
    {
        return 'Changes apply to the whole public site as soon as you save.';
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->model(SiteSetting::current())
            ->statePath('data')
            ->components([
                Tabs::make()->persistTabInQueryString()->tabs([
                    Tab::make('Colours')->icon(Heroicon::OutlinedSwatch)->schema([
                        Section::make('Light')
                            ->description('What most visitors see.')
                            ->schema([self::palette('light')]),
                        Section::make('Dark')
                            ->description('Shown to visitors whose device is set to dark mode.')
                            ->schema([
                                ToggleButtons::make('theme.darkMode')
                                    ->label('Dark mode')
                                    ->options(['auto' => 'Follow visitor\'s device', 'off' => 'Always light'])
                                    ->inline()
                                    ->live()
                                    ->required(),
                                self::palette('dark')->visible(fn (Get $get) => $get('theme.darkMode') === 'auto'),
                            ]),
                    ]),
                    Tab::make('Typography')->icon(Heroicon::OutlinedLanguage)->schema([
                        Section::make()->columns(2)->schema([
                            Select::make('theme.headingFont')
                                ->label('Headings and interface')
                                ->options(ThemeDefaults::HEADING_FONTS)
                                ->native(false)
                                ->required()
                                ->helperText('Names, titles, menus and buttons.'),
                            Select::make('theme.serifFont')
                                ->label('Serif voice')
                                ->options(ThemeDefaults::SERIF_FONTS)
                                ->native(false)
                                ->required()
                                ->helperText('Introductions, the hero question, essays.'),
                        ]),
                    ]),
                    Tab::make('Layout')->icon(Heroicon::OutlinedSquares2x2)->schema([
                        Section::make()->schema([
                            ToggleButtons::make('theme.buttonShape')
                                ->label('Button corners')
                                ->options(ThemeDefaults::BUTTON_SHAPES)
                                ->inline()
                                ->required(),
                            Toggle::make('theme.showGrid')
                                ->label('Show the drafting grid')
                                ->helperText('The fine grid lines behind the hero, page headers and calls to action.'),
                        ]),
                    ]),
                    Tab::make('Branding')->icon(Heroicon::OutlinedSparkles)->schema([
                        Section::make()->columns(2)->schema([
                            FileUpload::make('logo_path')
                                ->label('Logo')
                                ->image()->disk('public')->directory('branding')
                                ->helperText('Replaces the monogram in the header. SVG or PNG, around 40 px tall.'),
                            FileUpload::make('favicon_path')
                                ->label('Browser tab icon')
                                ->image()->disk('public')->directory('branding')
                                ->acceptedFileTypes(['image/png', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'])
                                ->helperText('Square PNG or SVG, at least 64 × 64.'),
                            TextInput::make('footer_note')
                                ->label('Footer note')
                                ->maxLength(160)
                                ->helperText('Shown next to the copyright line, e.g. "Built in Kathmandu".')
                                ->columnSpanFull(),
                        ]),
                    ]),
                    Tab::make('Custom CSS')->icon(Heroicon::OutlinedCodeBracket)->schema([
                        Section::make()
                            ->description('Advanced. Added after the site\'s own styles, so it can override anything.')
                            ->schema([
                                CodeEditor::make('custom_css')
                                    ->hiddenLabel()
                                    ->language(Language::Css),
                            ]),
                    ]),
                ]),
            ]);
    }

    private static function palette(string $mode): Grid
    {
        return Grid::make(['default' => 2, 'lg' => 3])->schema(
            collect(ThemeDefaults::COLOR_KEYS)->map(
                fn (string $label, string $key) => ColorPicker::make("theme.{$mode}.{$key}")
                    ->label($label)
                    ->regex('/^#[0-9a-fA-F]{6}$/')
                    ->required()
            )->values()->all()
        );
    }

    public function content(Schema $schema): Schema
    {
        return $schema->components([
            Form::make([EmbeddedSchema::make('form')])
                ->id('form')
                ->livewireSubmitHandler('save')
                ->footer([
                    Actions::make([
                        Action::make('save')->label('Save appearance')->submit('save')->keyBindings(['mod+s']),
                        Action::make('reset')
                            ->label('Reset colours and fonts')
                            ->color('gray')
                            ->requiresConfirmation()
                            ->modalDescription('Colours, fonts, button shape and grid go back to the original design. Logo, icon, footer note and custom CSS are kept.')
                            ->action(fn () => $this->resetTheme()),
                    ])->key('form-actions'),
                ]),
        ]);
    }

    public function save(): void
    {
        $state = $this->form->getState();
        $settings = SiteSetting::current();
        $settings->update([
            // Merge over what's saved: hidden fields (the dark palette when dark mode is off)
            // aren't submitted, and shouldn't be lost.
            'theme' => ThemeDefaults::merge(array_replace_recursive($settings->resolvedTheme(), $state['theme'] ?? [])),
            'logo_path' => $state['logo_path'] ?? null,
            'favicon_path' => $state['favicon_path'] ?? null,
            'footer_note' => $state['footer_note'] ?? null,
            'custom_css' => $state['custom_css'] ?? null,
        ]);

        Notification::make()->success()->title('Appearance saved')->send();
    }

    public function resetTheme(): void
    {
        SiteSetting::current()->update(['theme' => null]);
        $this->mount();

        Notification::make()->success()->title('Colours and fonts reset')->send();
    }
}
