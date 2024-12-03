<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\EquipmentType;

final readonly class SyncEquipmentTypeParameters
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $equipmentTypeId = $args["equipmentTypeId"];
        $parametersIds = $args["parametersIds"];

        // Найти EquipmentType или выбросить исключение
        $equipmentType = EquipmentType::findOrFail($equipmentTypeId)->parameters()->sync($parametersIds);

        // Синхронизировать параметры
        return EquipmentType::findOrFail($equipmentTypeId);
    }
}
