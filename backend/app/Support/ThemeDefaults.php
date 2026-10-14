<?php

namespace App\Support;

/**
 * The site's design settings, edited on the admin's Appearance screen.
 * Missing keys always fall back to these values, so older saved themes keep working.
 */
class ThemeDefaults
{
    public const COLOR_KEYS = [
        'background' => 'Page background',
        'surface' => 'Cards and fields',
        'text' => 'Text',
        'mutedText' => 'Secondary text',
        'lines' => 'Lines and borders',
        'button' => 'Buttons',
        'buttonText' => 'Button text',
        'ventures' => 'Ventures accent',
        'writing' => 'Writing accent',
        'contact' => 'Contact accent',
        'footer' => 'Footer background',
        'footerText' => 'Footer text',
    ];

    public const HEADING_FONTS = [
        'anek' => 'Anek Latin',
        'inter' => 'Inter',
        'geist' => 'Geist',
        'space-grotesk' => 'Space Grotesk',
        'manrope' => 'Manrope',
    ];

    public const SERIF_FONTS = [
        'newsreader' => 'Newsreader',
        'fraunces' => 'Fraunces',
        'playfair' => 'Playfair Display',
        'lora' => 'Lora',
        'instrument-serif' => 'Instrument Serif',
    ];

    public const BUTTON_SHAPES = [
        'sharp' => 'Sharp',
        'soft' => 'Soft',
        'pill' => 'Pill',
    ];

    public const THEME = [
        'light' => [
            'background' => '#f3f4f8',
            'surface' => '#ffffff',
            'text' => '#141a33',
            'mutedText' => '#4e5672',
            'lines' => '#d6d9e3',
            'button' => '#141a33',
            'buttonText' => '#f3f4f8',
            'ventures' => '#1d3a8f',
            'writing' => '#c8102e',
            'contact' => '#f2a900',
            'footer' => '#000000',
            'footerText' => '#f3f4f8',
        ],
        'dark' => [
            'background' => '#0e1224',
            'surface' => '#161b33',
            'text' => '#e8eaf2',
            'mutedText' => '#9ba2bc',
            'lines' => '#2a3150',
            'button' => '#e8eaf2',
            'buttonText' => '#0e1224',
            'ventures' => '#8fa8f2',
            'writing' => '#f0506a',
            'contact' => '#f2a900',
            'footer' => '#000000',
            'footerText' => '#f3f4f8',
        ],
        'darkMode' => 'auto',
        'headingFont' => 'anek',
        'serifFont' => 'newsreader',
        'buttonShape' => 'sharp',
        'showGrid' => true,
    ];

    /** Saved theme merged over the defaults, key by key. */
    public static function merge(?array $saved): array
    {
        $saved ??= [];

        return [
            ...self::THEME,
            ...array_intersect_key($saved, self::THEME),
            'light' => [...self::THEME['light'], ...array_filter($saved['light'] ?? [])],
            'dark' => [...self::THEME['dark'], ...array_filter($saved['dark'] ?? [])],
        ];
    }
}
