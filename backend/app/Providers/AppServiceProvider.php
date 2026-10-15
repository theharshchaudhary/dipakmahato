<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Auth\Events\Login;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Contact form posts arrive via the SSR server, which forwards the visitor's IP.
        // Limit per visitor, and cap each caller overall in case the forwarded IP is faked.
        RateLimiter::for('contact', fn (Request $request) => [
            Limit::perMinutes(10, 5)->by('visitor:'.($request->input('ip') ?: $request->ip())),
            Limit::perMinute(30)->by('caller:'.$request->ip()),
        ]);

        // Admin passwords: at least 12 characters with mixed case and a number; in
        // production, also refuse passwords that appear in public data breaches.
        Password::defaults(fn () => Password::min(12)
            ->mixedCase()
            ->numbers()
            ->when(app()->isProduction(), fn (Password $rule) => $rule->uncompromised()));

        // Remember when and where each admin last signed in (shown on profiles and the users list).
        Event::listen(Login::class, function (Login $event) {
            if ($event->user instanceof User) {
                $event->user->forceFill([
                    'last_login_at' => now(),
                    'last_login_ip' => request()->ip(),
                ])->saveQuietly();
            }
        });
    }
}
