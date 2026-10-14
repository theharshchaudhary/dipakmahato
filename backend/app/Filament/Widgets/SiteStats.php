<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Articles\ArticleResource;
use App\Filament\Resources\ContactMessages\ContactMessageResource;
use App\Filament\Resources\Ventures\VentureResource;
use App\Models\Article;
use App\Models\ContactMessage;
use App\Models\Venture;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class SiteStats extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $published = Article::query()->published()->count();
        $drafts = Article::query()->where('status', 'draft')->count();
        $unread = ContactMessage::query()->whereNull('read_at')->count();

        return [
            Stat::make('Published essays', $published)
                ->description($drafts ? "{$drafts} in draft" : 'No drafts')
                ->descriptionIcon(Heroicon::OutlinedPencilSquare)
                ->url(ArticleResource::getUrl()),
            Stat::make('Unread messages', $unread)
                ->description(ContactMessage::query()->count().' received in total')
                ->descriptionIcon(Heroicon::OutlinedInbox)
                ->color($unread > 0 ? 'warning' : 'gray')
                ->url(ContactMessageResource::getUrl()),
            Stat::make('Ventures on the site', Venture::query()->where('is_visible', true)->count())
                ->descriptionIcon(Heroicon::OutlinedBuildingOffice2)
                ->description('Shown on the Ventures page')
                ->url(VentureResource::getUrl()),
        ];
    }
}
