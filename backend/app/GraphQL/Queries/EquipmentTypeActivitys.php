<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\EquipmentTypeActivity;

final readonly class EquipmentTypeActivitys
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return ['items' => EquipmentTypeActivity::all()];
    }
}
