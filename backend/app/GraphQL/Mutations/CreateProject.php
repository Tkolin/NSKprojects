<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use App\Models\ProjectDelegations;
use App\Models\ProjectFacilities;

final readonly class CreateProject
{
    /**
     * Создает новый проект на основе переданных данных и связывает его с указанными объектами.
     *
     * @param null $_
     * @param array $args
     * @return Project
     */
    public function __invoke(null $_, array $args): Project
    {
        // Создаем новый проект
        $project = Project::create([
            'number' => $args['data']['number'],
            'name' => $args['data']['name'] ?? null,
            'organization_customer_id' => $args['data']['organization_customer_id'] ?? null,
            'type_project_document_id' => $args['data']['type_project_document_id'] ?? null,
            'date_signing' => isset($args['data']['date_signing']) ? substr((string) $args['data']['date_signing'], 0, 10) : null,
            'duration' => $args['data']['duration'] ?? null,
            'date_end' => isset($args['data']['date_end']) ? substr((string) $args['data']['date_end'], 0, 10) : null,
            'date_create' => isset($args['data']['date_create']) ? substr((string) $args['data']['date_create'], 0, 10) : null,
            'status_id' => $args['data']['status_id'] ?? null,
            'prepayment' => $args['data']['prepayment'] ?? null,
            'date_completion' => isset($args['data']['date_completion']) ? substr((string) $args['data']['date_completion'], 0, 10) : null,
            'price' => $args['data']['price'] ?? null,
        ]);

        // Связываем проект с указанными объектами
        if (isset($project['id'])) {
            if (isset($args['data']['facilitys_id'])) {
                foreach ($args['data']['facilitys_id'] as $facilityId) {
                    ProjectFacilities::create([
                        'project_id' => $project['id'],
                        'facility_id' => $facilityId
                    ]);
                }
            }
            if (isset($args['data']['delegates_id'])) {
                foreach ($args['data']['delegates_id'] as $delegateId) {
                    ProjectDelegations::create([
                        'project_id' => $project['id'],
                        'delegation_id' => $delegateId
                    ]);
                }
            }
        }

        return $project;
    }
}
