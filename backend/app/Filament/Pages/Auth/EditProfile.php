<?php

namespace App\Filament\Pages\Auth;

use App\Support\UserSessions;
use Filament\Actions\Action;
use Filament\Auth\Pages\EditProfile as BaseEditProfile;
use Filament\Facades\Filament;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\Flex;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Text;
use Filament\Schemas\Schema;
use Filament\Support\Enums\FontWeight;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;

/**
 * Profile: photo, name and email, password, two-factor sign-in, and the
 * devices this account is signed in on.
 */
class EditProfile extends BaseEditProfile
{
    public static function getLabel(): string
    {
        return 'Your profile';
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->inlineLabel(false)
            ->components([
                Section::make('Your details')
                    ->description('Your photo appears in the top-right corner of the admin.')
                    ->aside()
                    ->schema([
                        FileUpload::make('avatar_path')
                            ->label('Photo')
                            ->avatar()
                            ->image()
                            ->imageEditor()
                            ->circleCropper()
                            ->disk('public')
                            ->directory('avatars')
                            ->maxSize(4096),
                        $this->getNameFormComponent(),
                        $this->getEmailFormComponent(),
                    ]),
                Section::make('Password')
                    ->description('At least 12 characters, with upper and lower case letters and a number.')
                    ->aside()
                    ->schema([
                        $this->getPasswordFormComponent()->label('New password'),
                        $this->getPasswordConfirmationFormComponent()->label('Confirm new password'),
                        $this->getCurrentPasswordFormComponent()
                            ->label('Current password')
                            ->belowContent('Needed to change your email or password.'),
                    ]),
            ]);
    }

    public function content(Schema $schema): Schema
    {
        return $schema->components([
            $this->getFormContentComponent(),
            ...Arr::wrap($this->getMultiFactorAuthenticationContentComponent()),
            $this->getSessionsComponent(),
        ]);
    }

    public function getMultiFactorAuthenticationContentComponent(): ?Component
    {
        $component = parent::getMultiFactorAuthenticationContentComponent();

        return $component instanceof Section
            ? $component
                ->label(null)
                ->heading('Two-factor authentication')
                ->description('Ask for a code from an authenticator app (Google Authenticator, 1Password, Authy…) when signing in. Keep the recovery codes somewhere safe.')
                ->aside()
                ->compact(false)
                ->secondary(false)
            : $component;
    }

    protected function getSessionsComponent(): Component
    {
        $user = $this->getUser();
        $sessions = UserSessions::for($user, session()->getId());
        $others = count(array_filter($sessions, fn (array $s) => ! $s['current']));

        $rows = array_map(fn (array $s) => Flex::make([
            Text::make($s['device'])->weight(FontWeight::Medium),
            Text::make(collect([
                $s['ip'],
                $s['current'] ? 'This device' : 'Active '.$s['lastActive']->diffForHumans(),
            ])->filter()->join(', '))->color($s['current'] ? 'success' : 'gray')->grow(false),
        ]), $sessions);

        $lastLogin = $user->last_login_at
            ? 'Last sign-in '.$user->last_login_at->diffForHumans().($user->last_login_ip ? " from {$user->last_login_ip}" : '').'.'
            : null;

        return Section::make('Where you\'re signed in')
            ->description(collect(['Browsers and devices using this account.', $lastLogin])->filter()->join(' '))
            ->aside()
            ->schema([
                ...($rows ?: [Text::make('No active sessions found.')->color('gray')]),
                Actions::make([
                    Action::make('endOtherSessions')
                        ->label($others ? "Sign out {$others} other ".str('session')->plural($others) : 'No other sessions')
                        ->icon(Heroicon::OutlinedArrowRightStartOnRectangle)
                        ->color('gray')
                        ->disabled($others === 0)
                        ->requiresConfirmation()
                        ->modalHeading('Sign out other sessions')
                        ->modalDescription('Every other browser and device signed in to this account will be signed out. Enter your password to confirm.')
                        ->modalSubmitActionLabel('Sign out others')
                        ->schema([
                            TextInput::make('password')
                                ->label('Your password')
                                ->password()
                                ->revealable()
                                ->required()
                                ->currentPassword(guard: Filament::getAuthGuard()),
                        ])
                        ->action(function (array $data) {
                            // Rotates the password hash so "remember me" cookies elsewhere stop working too.
                            Auth::guard(Filament::getAuthGuard())->logoutOtherDevices($data['password']);
                            $ended = UserSessions::endOthers($this->getUser(), session()->getId());

                            Notification::make()
                                ->success()
                                ->title($ended ? "Signed out {$ended} other ".str('session')->plural($ended) : 'Other sessions signed out')
                                ->send();
                        }),
                ]),
            ]);
    }

    protected function getSavedNotificationTitle(): ?string
    {
        return 'Profile saved';
    }
}
