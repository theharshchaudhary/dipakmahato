<?php

namespace App\Filament\Resources\Ventures;

use App\Filament\Resources\Ventures\Pages\CreateVenture;
use App\Filament\Resources\Ventures\Pages\EditVenture;
use App\Filament\Resources\Ventures\Pages\ListVentures;
use App\Filament\Resources\Ventures\Schemas\VentureForm;
use App\Filament\Resources\Ventures\Tables\VenturesTable;
use App\Models\Venture;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class VentureResource extends Resource
{
    protected static ?string $model = Venture::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBuildingOffice2;

    protected static string|UnitEnum|null $navigationGroup = 'Content';

    protected static ?string $recordTitleAttribute = 'name';

    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return VentureForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return VenturesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListVentures::route('/'),
            'create' => CreateVenture::route('/create'),
            'edit' => EditVenture::route('/{record}/edit'),
        ];
    }
}
