<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Organization;

final readonly class CreateOrganization
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return Organization::create($args);
    }
}
