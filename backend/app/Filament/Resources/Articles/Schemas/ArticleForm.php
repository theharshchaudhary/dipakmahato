<?php

namespace App\Filament\Resources\Articles\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ArticleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Group::make()->columnSpan(['lg' => 2])->schema([
                    Section::make()->schema([
                        TextInput::make('title')
                            ->required()
                            ->maxLength(160)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (Set $set, ?string $state, string $operation) {
                                if ($operation === 'create') {
                                    $set('slug', Str::slug((string) $state));
                                }
                            }),
                        TextInput::make('slug')
                            ->label('Address')
                            ->prefix('/writing/')
                            ->required()
                            ->alphaDash()
                            ->maxLength(160)
                            ->unique(ignoreRecord: true)
                            ->helperText('Changing this after publishing breaks existing links.'),
                        TextInput::make('subtitle')->maxLength(200),
                        Textarea::make('excerpt')
                            ->label('Summary')
                            ->required()
                            ->rows(2)
                            ->maxLength(300)
                            ->helperText('Shown in essay lists, and in Google if no description is set below.'),
                        RichEditor::make('body')
                            ->label('Essay')
                            ->required()
                            ->fileAttachmentsDisk('public')
                            ->fileAttachmentsDirectory('articles')
                            ->toolbarButtons([
                                ['bold', 'italic', 'link'],
                                ['h2', 'h3'],
                                ['blockquote', 'bulletList', 'orderedList'],
                                ['attachFiles'],
                                ['undo', 'redo'],
                            ])
                            ->helperText('Each "Heading 2" becomes an entry in the essay\'s contents list.'),
                    ]),
                    Section::make('Search & sharing')
                        ->collapsible()
                        ->schema([
                            TextInput::make('meta_title')
                                ->label('Title in Google')
                                ->maxLength(70)
                                ->helperText('Leave empty to use the essay title.'),
                            Textarea::make('meta_description')
                                ->label('Description in Google')
                                ->rows(2)
                                ->maxLength(170)
                                ->helperText('Leave empty to use the summary.'),
                        ]),
                ]),
                Group::make()->schema([
                    Section::make('Publishing')->schema([
                        Select::make('status')
                            ->options(['draft' => 'Draft', 'published' => 'Published'])
                            ->default('draft')
                            ->required()
                            ->helperText('Drafts are never shown on the site or to Google.'),
                        DateTimePicker::make('published_at')
                            ->label('Publish date')
                            ->seconds(false)
                            ->helperText('Set automatically when published. A future date schedules the essay.'),
                        Toggle::make('featured')->helperText('Shown large at the top of the Writing page.'),
                    ]),
                    Section::make('Details')->schema([
                        Select::make('category_id')
                            ->label('Topic')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload()
                            ->createOptionForm([
                                TextInput::make('name')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug((string) $state))),
                                TextInput::make('slug')->required()->alphaDash()->unique('categories', 'slug'),
                            ]),
                        FileUpload::make('cover_image_path')
                            ->label('Cover image')
                            ->image()->imageEditor()->disk('public')->directory('articles')
                            ->helperText('Used when the essay is shared. 1200 × 630.'),
                    ]),
                ]),
            ]);
    }
}
