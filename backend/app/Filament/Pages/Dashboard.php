<?php

namespace App\Filament\Pages;

use App\Filament\Resources\Articles\ArticleResource;
use App\Filament\Resources\Pages\PageResource;
use App\Models\Page;
use App\Models\SiteSetting;
use Filament\Actions\Action;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Support\Icons\Heroicon;

class Dashboard extends BaseDashboard
{
    public function getSubheading(): ?string
    {
        return 'Everything on the public site is edited from here.';
    }

    public function getColumns(): int|array
    {
        return 2;
    }

    protected function getHeaderActions(): array
    {
        $home = Page::query()->where('key', 'home')->first();

        return [
            Action::make('write')
                ->label('Write an essay')
                ->icon(Heroicon::OutlinedPencilSquare)
                ->url(ArticleResource::getUrl('create')),
            Action::make('home')
                ->label('Edit home page')
                ->color('gray')
                ->icon(Heroicon::OutlinedHome)
                ->visible((bool) $home)
                ->url(fn () => PageResource::getUrl('edit', ['record' => $home])),
            Action::make('appearance')
                ->label('Appearance')
                ->color('gray')
                ->icon(Heroicon::OutlinedSwatch)
                ->url(ManageAppearance::getUrl()),
            Action::make('site')
                ->label('View site')
                ->color('gray')
                ->icon(Heroicon::OutlinedArrowTopRightOnSquare)
                ->url(fn () => SiteSetting::current()->site_url)
                ->openUrlInNewTab(),
        ];
    }
}
