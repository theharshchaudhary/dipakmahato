<?php

namespace App\Models;

use App\Models\Concerns\FlushesContentCache;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use FlushesContentCache;

    /** The fixed pages the frontend knows how to render, with their URL paths. */
    public const PATHS = [
        'home' => '/',
        'about' => '/about',
        'writing' => '/writing',
        'ventures' => '/ventures',
        'contact' => '/contact',
    ];

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'show_in_nav' => 'boolean',
        ];
    }

    public function path(): string
    {
        return self::PATHS[$this->key] ?? '/';
    }
}
