<?php

namespace App\Support;

/**
 * Starting copy for the home page hero. The hero reads as one sentence across
 * the layout: greeting + name, the intro on the left, the question on the right.
 */
class HomeHeroDefaults
{
    public const CONTENT = [
        'heroKeywords' => ['Leadership', 'Strategy', 'Vision'],
        'heroHandle' => null,
        'heroGreeting' => "Hello, I'm",
        'heroIntro' => 'and if your business is still waiting for the right moment to change,',
        'heroQuestion' => "are you ready for what's next?",
        'heroMonogram' => 'DK',
        'heroSignature' => 'Dipak K. Mahato',
        'heroSignatureNote' => 'Portfolio',
    ];

    /** Keys the old hero used, replaced by the fields above. */
    public const RETIRED = ['heroHeadline', 'heroLead'];
}
