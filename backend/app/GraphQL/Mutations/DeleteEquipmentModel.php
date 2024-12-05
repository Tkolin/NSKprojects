<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\EquipmentModel;

final readonly class DeleteEquipmentModel
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        EquipmentModel::destroy($args['id']);
        return true;
    }
}
