<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\EquipmentGroup;

final readonly class EquipmentGroups
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return ['items ' => EquipmentGroup::all()];
    }
}
