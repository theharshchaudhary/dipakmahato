<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Articles\ArticleResource;
use App\Models\Article;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class RecentEssays extends TableWidget
{
    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = 1;

    public function table(Table $table): Table
    {
        return $table
            ->heading('Recently edited essays')
            ->query(Article::query()->latest('updated_at')->limit(5))
            ->paginated(false)
            ->emptyStateHeading('No essays yet')
            ->columns([
                TextColumn::make('title')->limit(40),
                TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (Article $record) => $record->isLive() ? 'Published' : ($record->status === 'published' ? 'Scheduled' : 'Draft'))
                    ->color(fn (Article $record) => $record->isLive() ? 'success' : 'gray'),
            ])
            ->recordUrl(fn (Article $record) => ArticleResource::getUrl('edit', ['record' => $record]))
            ->headerActions([
                Action::make('new')->label('Write an essay')->link()->url(ArticleResource::getUrl('create')),
            ]);
    }
}
