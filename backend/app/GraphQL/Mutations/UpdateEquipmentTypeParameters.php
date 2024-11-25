<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\EquipmentType;

final readonly class UpdateEquipmentTypeParameters
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        // Извлечение аргументов
        $equipmentTypeId = $args['equipment_type_id'] ?? null;
        $addParameterIds = $args['add_parameter_ids'] ?? [];
        $removeParameterIds = $args['remove_parameter_ids'] ?? [];

        // Проверка обязательных параметров
        if (!$equipmentTypeId) {
            throw new \InvalidArgumentException('equipment_type_id is required.');
        }

        // Найти оборудование по ID
        $equipmentType = EquipmentType::find($equipmentTypeId);
        if (!$equipmentType) {
            throw new \InvalidArgumentException("EquipmentType with ID $equipmentTypeId not found.");
        }

        // Добавление параметров
        if (!empty($addParameterIds)) {
            $equipmentType->parameters()->syncWithoutDetaching($addParameterIds);
        }

        // Удаление параметров
        if (!empty($removeParameterIds)) {
            $equipmentType->parameters()->detach($removeParameterIds);
        }

        // Возвращение результата
        return [
            'equipment_type_id' => $equipmentTypeId,
            'added_parameters' => $addParameterIds,
            'removed_parameters' => $removeParameterIds,
        ];
    }
}
