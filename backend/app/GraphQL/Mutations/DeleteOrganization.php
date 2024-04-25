<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Organization;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeleteOrganization
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args): bool
    {
        Organization::destroy($args['id']);
        return true;
    }
}
