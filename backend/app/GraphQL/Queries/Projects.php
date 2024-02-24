<?php

namespace App\GraphQL\Queries;
use App\Models\Project;
use App\GraphQL\Service\AuthorizationService;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class Projects
{
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            return Project::all();
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
