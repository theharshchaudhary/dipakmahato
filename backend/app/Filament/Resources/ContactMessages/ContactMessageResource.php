<?php

namespace App\Filament\Resources\ContactMessages;

use App\Filament\Resources\ContactMessages\Pages\ListContactMessages;
use App\Filament\Resources\ContactMessages\Pages\ViewContactMessage;
use App\Filament\Resources\ContactMessages\Tables\ContactMessagesTable;
use App\Models\ContactMessage;
use BackedEnum;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

/** Messages sent through the contact form. Read-only. */
class ContactMessageResource extends Resource
{
    protected static ?string $model = ContactMessage::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedInbox;

    protected static ?string $navigationLabel = 'Messages';

    protected static ?string $modelLabel = 'message';

    protected static ?string $recordTitleAttribute = 'subject';

    protected static ?int $navigationSort = 5;

    public static function getNavigationBadge(): ?string
    {
        $unread = ContactMessage::query()->whereNull('read_at')->count();

        return $unread > 0 ? (string) $unread : null;
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make()->columns(2)->schema([
                    TextEntry::make('name'),
                    TextEntry::make('email')->copyable()->url(fn (ContactMessage $record) => "mailto:{$record->email}"),
                    TextEntry::make('subject')->columnSpanFull(),
                    TextEntry::make('message')->columnSpanFull()->prose(),
                    TextEntry::make('created_at')->label('Received')->dateTime(),
                    TextEntry::make('ip_address')->label('IP address')->placeholder('—'),
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return ContactMessagesTable::configure($table);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => ListContactMessages::route('/'),
            'view' => ViewContactMessage::route('/{record}'),
        ];
    }
}
