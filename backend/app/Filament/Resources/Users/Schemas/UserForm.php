<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Illuminate\Validation\Rules\Password;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                FileUpload::make('avatar_path')
                    ->label('Photo')
                    ->avatar()
                    ->image()
                    ->imageEditor()
                    ->circleCropper()
                    ->disk('public')
                    ->directory('avatars')
                    ->columnSpanFull(),
                TextInput::make('name')->required()->maxLength(120),
                TextInput::make('email')->email()->required()->unique(ignoreRecord: true),
                TextInput::make('password')
                    ->password()
                    ->revealable()
                    ->rule(Password::default())
                    ->required(fn (string $operation) => $operation === 'create')
                    // Leave empty when editing to keep the current password.
                    ->dehydrated(fn (?string $state) => filled($state))
                    ->helperText(fn (string $operation) => $operation === 'edit'
                        ? 'Leave empty to keep the current password.'
                        : 'At least 12 characters, with upper and lower case letters and a number.'),
            ]);
    }
}
