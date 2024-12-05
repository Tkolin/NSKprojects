<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\EquipmentModel;

final readonly class UpdateEquipmentModel
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return EquipmentModel::findOrFail($args['id'])->update($args["data"]);
    }
}
