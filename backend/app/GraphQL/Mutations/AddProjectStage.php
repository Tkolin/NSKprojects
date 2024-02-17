<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\ProjectStage;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class AddProjectStage
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context):ProjectStage
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            $projectStage = ProjectStage::create($args);
            return $projectStage;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }

    }
}
