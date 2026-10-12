<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

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
    }
}
