<?php

namespace App\Filament\Resources\Pages\Pages;

use App\Filament\Resources\Pages\PageResource;
use App\Models\SiteSetting;
use Filament\Actions\Action;
use Filament\Resources\Pages\EditRecord;

class EditPage extends EditRecord
{
    protected static string $resource = PageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('view')
                ->label('View page')
                ->color('gray')
                ->icon('heroicon-o-arrow-top-right-on-square')
                ->url(fn () => rtrim(SiteSetting::current()->site_url, '/').$this->getRecord()->path())
                ->openUrlInNewTab(),
        ];
    }
}
