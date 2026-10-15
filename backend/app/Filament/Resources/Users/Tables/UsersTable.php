<?php

namespace App\Filament\Resources\Users\Tables;

use App\Models\User;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('avatar_path')
                    ->label('')
                    ->disk('public')
                    ->circular()
                    ->width(36),
                TextColumn::make('name')->weight('bold')->searchable(),
                TextColumn::make('email')->searchable(),
                IconColumn::make('two_factor')
                    ->label('Two-factor')
                    ->state(fn (User $record) => $record->hasTwoFactorEnabled())
                    ->boolean(),
                TextColumn::make('last_login_at')
                    ->label('Last sign-in')
                    ->since()
                    ->placeholder('Never')
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
                // For an admin who lost their phone: they sign in with just a password and can set it up again.
                Action::make('resetTwoFactor')
                    ->label('Reset two-factor')
                    ->icon(Heroicon::OutlinedShieldExclamation)
                    ->color('warning')
                    ->visible(fn (User $record) => $record->hasTwoFactorEnabled())
                    ->requiresConfirmation()
                    ->modalDescription(fn (User $record) => "{$record->name} will sign in with only a password until they set up two-factor again.")
                    ->action(function (User $record) {
                        $record->forceFill([
                            'app_authentication_secret' => null,
                            'app_authentication_recovery_codes' => null,
                        ])->save();

                        Notification::make()->success()->title('Two-factor reset')->send();
                    }),
            ]);
    }
}
