<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\ContactMessages\ContactMessageResource;
use App\Models\ContactMessage;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class LatestMessages extends TableWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 1;

    public function table(Table $table): Table
    {
        return $table
            ->heading('Latest messages')
            ->query(ContactMessage::query()->latest()->limit(5))
            ->paginated(false)
            ->emptyStateHeading('No messages yet')
            ->emptyStateDescription('Messages sent from the contact page will appear here.')
            ->columns([
                TextColumn::make('subject')
                    ->limit(40)
                    ->weight(fn (ContactMessage $record) => $record->read_at ? null : 'bold')
                    ->description(fn (ContactMessage $record) => $record->name),
                TextColumn::make('created_at')->label('Received')->since(),
            ])
            ->recordUrl(fn (ContactMessage $record) => ContactMessageResource::getUrl('view', ['record' => $record]))
            ->headerActions([
                Action::make('all')->label('Open inbox')->link()->url(ContactMessageResource::getUrl()),
            ]);
    }
}
