<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Organization;

final readonly class DeleteOrganization
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args): bool
    {
        Organization::destroy($args['id']);
        return true;
    }
}
