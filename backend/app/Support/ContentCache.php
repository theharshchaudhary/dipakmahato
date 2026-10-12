<?php

namespace App\Support;

use Closure;
use Illuminate\Support\Facades\Cache;

/**
 * Caches public API payloads. Every content change bumps a version number, so
 * all cached entries go stale at once without needing cache tags (which the
 * file and database drivers don't support).
 */
class ContentCache
{
    private const VERSION_KEY = 'content:version';

    public static function remember(string $key, Closure $callback): mixed
    {
        $version = Cache::get(self::VERSION_KEY, 1);

        return Cache::remember("content:v{$version}:{$key}", now()->addDay(), $callback);
    }

    public static function flush(): void
    {
        Cache::forever(self::VERSION_KEY, Cache::get(self::VERSION_KEY, 1) + 1);
    }
}
