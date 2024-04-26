<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Organization;

final readonly class UpdateOrganization
{

    public function __invoke(null $_, array $args): Organization
    {

            return Organization::findOrFail($args['id'])->update($args);

    }
}
