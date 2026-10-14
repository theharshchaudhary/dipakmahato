<?php

namespace App\Models;

use App\Models\Concerns\FlushesContentCache;
use App\Support\ThemeDefaults;
use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    use FlushesContentCache;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'alternate_names' => 'array',
            'same_as' => 'array',
            'theme' => 'array',
        ];
    }

    /** The saved design settings over the defaults. */
    public function resolvedTheme(): array
    {
        return ThemeDefaults::merge($this->theme);
    }

    /** The single settings row, created on first use. */
    public static function current(): self
    {
        return static::query()->firstOrFail();
    }
}
