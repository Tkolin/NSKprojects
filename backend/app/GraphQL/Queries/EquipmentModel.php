<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

final readonly class EquipmentModel
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['id']))
            throw new \InvalidArgumentException('id is required.');

        $id = $args['id'];
        return \App\Models\EquipmentModel::find($id);
    }
}
