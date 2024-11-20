<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\EquipmentType;

final readonly class EquipmentTypes
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return ['items ' => EquipmentType::all()];
    }
}
