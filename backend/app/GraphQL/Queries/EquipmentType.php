<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\EquipmentType as ModelsEquipmentType;

final readonly class EquipmentType
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['id']))
            throw new \InvalidArgumentException('id is required.');

        $id = $args['id'];
        return ModelsEquipmentType::find($id);
    }
}
