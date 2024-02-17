<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Project;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class ProjectStagesGroup
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            $projects = Project::with('stages')->get();

            $projectStagesGroups = [];

            foreach ($projects as $project) {
                $stages = [];

                foreach ($project->stages as $stage) {
                    $stages[] = [
                        'id' => $stage->id,
                        'stage_name' => $stage->name,
                        'progress' => $stage->progress,
                        'date_start' => $stage->date_start,
                        'duration' => $stage->duration,
                    ];
                }

                $projectStagesGroups[] = [
                    'id' => $project->id,
                    'name' => $project->name,
                    'stages' => $stages,
                ];
            }

            return $projectStagesGroups;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
