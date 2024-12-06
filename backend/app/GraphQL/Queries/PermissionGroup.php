<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\PermissionGroup as ModelsPermissionGroup;

final readonly class PermissionGroup
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['id']))
            throw new \InvalidArgumentException('id is required.');

        $id = $args['id'];
        return ModelsPermissionGroup::find($id);
    }
}
