<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\EquipmentTypeActivity;

final readonly class DeleteEquipmentTypeActivity
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        EquipmentTypeActivity::destroy($args['id']);
        return true;
    }
}
