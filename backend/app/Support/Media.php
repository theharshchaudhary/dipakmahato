<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class Media
{
    /** Absolute public URL for a file on the public disk, or null. */
    public static function url(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        return Storage::disk('public')->url($path);
    }
}
