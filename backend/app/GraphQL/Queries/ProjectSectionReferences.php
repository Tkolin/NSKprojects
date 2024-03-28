<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\ProjectSectionsReference;
use App\Models\ProjectStage;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class ProjectSectionReferences
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin','bookkeeper']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $query = ProjectSectionsReference::with('project:id,name')
                ->with('section_reference');

            if (isset($args['projectId'])) {
                $searchTerm = $args['projectId'];
                $query = $query
                    ->where('project_id', $searchTerm);
            }
            else
                return null;

            return $query->get();
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }

    }
}
