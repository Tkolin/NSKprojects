<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\EquipmentType;

final readonly class DeleteEquipmentType
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        EquipmentType::destroy($args['id']);
        return true;
    }
}
