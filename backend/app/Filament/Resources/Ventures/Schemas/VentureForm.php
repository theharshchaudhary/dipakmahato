<?php

namespace App\Filament\Resources\Ventures\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class VentureForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Group::make()->columnSpan(['lg' => 2])->schema([
                    Section::make()->columns(2)->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(80)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (Set $set, ?string $state, string $operation) {
                                if ($operation === 'create') {
                                    $set('slug', Str::slug((string) $state));
                                }
                            }),
                        TextInput::make('slug')->required()->alphaDash()->unique(ignoreRecord: true),
                        TextInput::make('tagline')->required()->maxLength(160)->columnSpanFull(),
                        TextInput::make('role')->label("Dipak's role")->required()->maxLength(120),
                        TextInput::make('website_url')->label('Website')->url()->maxLength(255),
                        Textarea::make('description')->label('The company')->required()->rows(3)->columnSpanFull(),
                        Textarea::make('problem')->label('The problem')->rows(3)->columnSpanFull(),
                        Textarea::make('product')->label('The product')->rows(3)->columnSpanFull(),
                        TagsInput::make('milestones')
                            ->helperText('Press Enter after each milestone. Verified facts only.')
                            ->columnSpanFull(),
                    ]),
                ]),
                Group::make()->schema([
                    Section::make('Display')->schema([
                        Toggle::make('is_visible')->label('Show on site')->default(true),
                        Toggle::make('is_primary')->label('Current main venture')
                            ->helperText('Featured in the home page spotlight.'),
                        TextInput::make('sort')->label('Order')->numeric()->default(0),
                    ]),
                    Section::make('Images')->schema([
                        FileUpload::make('logo_path')
                            ->label('Logo')
                            ->image()->disk('public')->directory('ventures')
                            ->helperText('Square, at least 200 × 200. Shown in the frame until a brand image is added.'),
                        FileUpload::make('cover_image_path')
                            ->label('Brand image')
                            ->image()->imageEditor()->disk('public')->directory('ventures'),
                        FileUpload::make('screenshots')
                            ->label('Product screenshots')
                            ->image()->multiple()->reorderable()->maxFiles(6)
                            ->disk('public')->directory('ventures'),
                    ]),
                ]),
            ]);
    }
}
