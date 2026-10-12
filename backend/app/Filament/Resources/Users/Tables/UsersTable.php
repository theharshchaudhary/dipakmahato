<?php

namespace App\Filament\Resources\Users\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->weight('bold'),
                TextColumn::make('email'),
                TextColumn::make('created_at')->label('Added')->date(),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
