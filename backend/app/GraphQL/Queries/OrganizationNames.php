<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Organization;

final readonly class OrganizationNames
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return Organization::select('id','name')->get();
    }
}
