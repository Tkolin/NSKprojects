<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\ProjectStage;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class ProjectStages
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $projectsQuery = ProjectStage::with('project:id,name')
                ->with('stage');

            if (isset($args['projectId'])) {
                $searchTerm = $args['projectId'];
                $projectsQuery = $projectsQuery
                    ->where('project_id', $searchTerm);
            }
            else
                return null;

            return $projectsQuery->get();
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }

    }
}
