<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\PermissionGroup;

final readonly class PermissionGroups
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return ['items' => PermissionGroup::all(), 'count' => 10];
    }
}
