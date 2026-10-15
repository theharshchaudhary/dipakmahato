<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/** The browsers and devices an admin is signed in on (database session driver). */
class UserSessions
{
    /**
     * @return list<array{id: string, device: string, ip: ?string, lastActive: Carbon, current: bool}>
     */
    public static function for(User $user, ?string $currentId): array
    {
        if (config('session.driver') !== 'database') {
            return [];
        }

        return DB::table(config('session.table', 'sessions'))
            ->where('user_id', $user->getKey())
            ->orderByDesc('last_activity')
            ->get()
            ->map(fn (object $s) => [
                'id' => $s->id,
                'device' => self::describe($s->user_agent),
                'ip' => $s->ip_address,
                'lastActive' => Carbon::createFromTimestamp($s->last_activity),
                'current' => $s->id === $currentId,
            ])
            ->values()
            ->all();
    }

    /** Ends every other session for the user; returns how many were ended. */
    public static function endOthers(User $user, ?string $currentId): int
    {
        if (config('session.driver') !== 'database') {
            return 0;
        }

        return DB::table(config('session.table', 'sessions'))
            ->where('user_id', $user->getKey())
            ->when($currentId, fn ($q) => $q->where('id', '!=', $currentId))
            ->delete();
    }

    /** "Chrome on Windows" from a user-agent string. */
    public static function describe(?string $agent): string
    {
        $agent ??= '';

        $browser = match (true) {
            str_contains($agent, 'Edg/') => 'Edge',
            str_contains($agent, 'OPR/'), str_contains($agent, 'Opera') => 'Opera',
            str_contains($agent, 'Firefox/') => 'Firefox',
            str_contains($agent, 'Chrome/'), str_contains($agent, 'CriOS/') => 'Chrome',
            str_contains($agent, 'Safari/') => 'Safari',
            default => 'Unknown browser',
        };

        $os = match (true) {
            str_contains($agent, 'iPhone'), str_contains($agent, 'iPad') => 'iOS',
            str_contains($agent, 'Android') => 'Android',
            str_contains($agent, 'Windows') => 'Windows',
            str_contains($agent, 'Mac OS X'), str_contains($agent, 'Macintosh') => 'macOS',
            str_contains($agent, 'Linux') => 'Linux',
            default => 'unknown device',
        };

        return "{$browser} on {$os}";
    }
}
