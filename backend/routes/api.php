<?php

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ContentController;
use Illuminate\Support\Facades\Route;

Route::controller(ContentController::class)->group(function () {
    Route::get('site', 'site');
    Route::get('pages/{key}', 'page');
    Route::get('articles', 'articles');
    Route::get('articles/{slug}', 'article');
    Route::get('ventures', 'ventures');
    Route::get('sitemap', 'sitemap');
});

Route::post('contact', [ContactController::class, 'store'])->middleware('throttle:contact');
