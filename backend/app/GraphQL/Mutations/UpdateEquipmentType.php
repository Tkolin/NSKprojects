<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\EquipmentType;

final readonly class UpdateEquipmentType
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return EquipmentType::findOrFail($args['id'])->update($args["data"]);
    }
}
