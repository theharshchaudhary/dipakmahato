<?php

namespace App\Filament\Resources\Articles\Tables;

use App\Models\Article;
use App\Models\SiteSetting;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ArticlesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('updated_at', 'desc')
            ->columns([
                TextColumn::make('title')->searchable()->wrap()->weight('bold'),
                TextColumn::make('category.name')->label('Topic')->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (Article $record) => match (true) {
                        $record->isLive() => 'Published',
                        $record->status === 'published' => 'Scheduled',
                        default => 'Draft',
                    })
                    ->color(fn (Article $record) => match (true) {
                        $record->isLive() => 'success',
                        $record->status === 'published' => 'info',
                        default => 'gray',
                    }),
                TextColumn::make('published_at')->label('Publish date')->date()->sortable()->placeholder('—'),
                IconColumn::make('featured')->boolean(),
                TextColumn::make('reading_minutes')->label('Read')->suffix(' min'),
                TextColumn::make('updated_at')->label('Last edited')->since()->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')->options(['draft' => 'Draft', 'published' => 'Published']),
                SelectFilter::make('category')->label('Topic')->relationship('category', 'name'),
            ])
            ->recordActions([
                EditAction::make(),
                Action::make('view')
                    ->label('View')
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->visible(fn (Article $record) => $record->isLive())
                    ->url(fn (Article $record) => rtrim(SiteSetting::current()->site_url, '/')."/writing/{$record->slug}")
                    ->openUrlInNewTab(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
