<?php

namespace App\Models;

use App\Models\Concerns\FlushesContentCache;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Venture extends Model
{
    use FlushesContentCache;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'milestones' => 'array',
            'screenshots' => 'array',
            'is_primary' => 'boolean',
            'is_visible' => 'boolean',
        ];
    }

    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('is_visible', true)->orderByDesc('is_primary')->orderBy('sort');
    }
}
