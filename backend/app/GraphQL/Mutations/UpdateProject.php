<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Project;
use App\Models\ProjectDelegations;
use App\Models\ProjectFacilities;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UpdateProject
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context): Project
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            $project = Project::findOrFail($args['data']['id']);

            $project->update([
                'number' => $args['data']['number'],
                'name' => $args['data']['name'] ?? null,
                'organization_customer_id' => $args['data']['organization_customer_id'] ?? null,
                'type_project_document_id' => $args['data']['type_project_document_id'] ?? null,
                'date_signing' => isset($args['data']['date_signing']) ? substr((string) $args['data']['date_signing'], 0, 10) : null,
                'duration' => $args['data']['duration'] ?? null,
                'date_create' => isset($args['data']['date_end']) ? substr((string) $args['data']['date_create'], 0, 10) : null,

                'date_end' => isset($args['data']['date_end']) ? substr((string) $args['data']['date_end'], 0, 10) : null,
                'status_id' => $args['data']['status_id'] ?? null,
                'date_completion' => isset($args['data']['date_completion']) ? substr((string) $args['data']['date_completion'], 0, 10) : null,
                'price' => $args['data']['price'] ?? null,
            ]);

            // Update or create new ProjectFacilities
            if (isset($project['id'])) {
                if (isset($args['data']['facilitys_id'])) {
                    foreach ($args['data']['facilitys_id'] as $facilityId) {
                        ProjectFacilities::updateOrCreate([
                            'project_id' => $project['id'],
                            'facility_id' => $facilityId
                        ]);
                    }
                    ProjectFacilities::where('project_id', $project['id'])
                        ->whereNotIn('facility_id', $args['data']['facilitys_id'])
                        ->delete();
                }

                // Update or create new ProjectDelegations
                if (isset($args['data']['delegates_id'])) {
                    foreach ($args['data']['delegates_id'] as $delegateId) {
                        ProjectDelegations::updateOrCreate([
                            'project_id' => $project['id'],
                            'delegation_id' => $delegateId
                        ]);
                    }
                    ProjectDelegations::where('project_id', $project['id'])
                        ->whereNotIn('delegation_id', $args['data']['delegates_id'])
                        ->delete();
                }
            }

            return $project;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }

    }
}
