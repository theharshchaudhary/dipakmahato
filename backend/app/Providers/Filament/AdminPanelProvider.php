<?php

namespace App\Providers\Filament;

use App\Filament\Pages\Auth\EditProfile;
use App\Filament\Pages\Dashboard;
use App\Models\SiteSetting;
use App\Support\Media;
use Filament\Actions\Action;
use Filament\Auth\MultiFactor\App\AppAuthentication;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Navigation\NavigationGroup;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Support\Icons\Heroicon;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Throwable;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->profile(EditProfile::class, isSimple: false)
            ->multiFactorAuthentication([
                AppAuthentication::make()->recoverable(),
            ])
            ->spa()
            ->sidebarCollapsibleOnDesktop()
            ->maxContentWidth('7xl')
            // Branding follows the site's own settings, read per request.
            ->brandName(fn () => (self::settings()?->short_name ?? 'Site').' — admin')
            ->brandLogo(fn () => Media::url(self::settings()?->logo_path))
            ->brandLogoHeight('2rem')
            // Same icon as the public site: the uploaded one, or the generated monogram.
            ->favicon(fn () => Media::url(self::settings()?->favicon_path)
                ?? rtrim(self::settings()?->site_url ?? '', '/').'/favicon.svg')
            // A fixed palette keeps admin buttons readable whatever colours the site uses.
            ->colors([
                'primary' => Color::Blue,
                'gray' => Color::Slate,
            ])
            ->navigationGroups([
                NavigationGroup::make('Content'),
                NavigationGroup::make('Inbox'),
                NavigationGroup::make('Design'),
                NavigationGroup::make('Settings')->collapsed(),
            ])
            ->userMenuItems([
                Action::make('site')
                    ->label('View website')
                    ->icon(Heroicon::OutlinedArrowTopRightOnSquare)
                    ->url(fn () => self::settings()?->site_url ?? '/')
                    ->openUrlInNewTab(),
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }

    /** Site settings, or null before the database is set up. */
    private static function settings(): ?SiteSetting
    {
        try {
            return once(fn () => SiteSetting::query()->first());
        } catch (Throwable) {
            return null;
        }
    }
}
