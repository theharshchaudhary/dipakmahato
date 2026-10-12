<?php

namespace App\Filament\Resources\Ventures\Pages;

use App\Filament\Resources\Ventures\VentureResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditVenture extends EditRecord
{
    protected static string $resource = VentureResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
