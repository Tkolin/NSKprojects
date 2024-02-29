<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Organization;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UpdateOrganization
{

    public function __invoke(null $_, array $args, GraphQLContext $context): Organization
    {
        $allowedRoles = ['admin','bookkeeper']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            $organization = Organization::findOrFail($args['id']);
            $organization->update($args);
            return $organization;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }

    }
}
