<?php

namespace App\Filament\Resources\Ventures\Pages;

use App\Filament\Resources\Ventures\VentureResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListVentures extends ListRecords
{
    protected static string $resource = VentureResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
