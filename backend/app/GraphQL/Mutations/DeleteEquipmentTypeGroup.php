<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\EquipmentGroup;

final readonly class DeleteEquipmentTypeGroup
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        EquipmentGroup::destroy($args['id']);
        return true;
    }
}
