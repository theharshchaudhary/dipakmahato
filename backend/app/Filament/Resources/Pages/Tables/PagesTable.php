<?php

namespace App\Filament\Resources\Pages\Tables;

use App\Models\Page;
use App\Models\SiteSetting;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PagesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('nav_order')
            ->paginated(false)
            ->columns([
                TextColumn::make('nav_label')->label('Page')->weight('bold'),
                TextColumn::make('key')->label('Address')->formatStateUsing(fn (Page $record) => $record->path()),
                TextColumn::make('meta_title')->label('Google title')->limit(50)->placeholder('Default'),
                IconColumn::make('show_in_nav')->label('In menu')->boolean(),
                TextColumn::make('updated_at')->label('Last edited')->since(),
            ])
            ->recordActions([
                EditAction::make(),
                Action::make('view')
                    ->label('View')
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->url(fn (Page $record) => rtrim(SiteSetting::current()->site_url, '/').$record->path())
                    ->openUrlInNewTab(),
            ]);
    }
}
