<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\EquipmentTypeActivity;

final readonly class UpdateEquipmentTypeActivity
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return EquipmentTypeActivity::findOrFail($args['id'])->update($args["data"]);
    }
}
