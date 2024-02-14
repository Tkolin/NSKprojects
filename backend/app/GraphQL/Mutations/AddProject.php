<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;

final readonly class AddProject
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): Project
    {
        $project = Project::create([
            'number' => $args['number'],
            'name' => $args['name'] ?? null,
            'organization_customer_id' => $args['organization_customer_id'] ?? null,
            'type_project_document_id' => $args['type_project_document_id'] ?? null,
            'facility_id' => $args['facility_id'] ?? null,
            'date_signing' => isset($args['date_signing']) ? substr((string) $args['date_signing'], 0, 10) : null,
            'duration' => $args['duration'] ?? null,
            'date_end' => isset($args['date_end']) ? substr((string) $args['date_end'], 0, 10) : null,
            'status_id' => $args['status_id'] ?? null,
            'date_completion' => isset($args['date_completion']) ? substr((string) $args['date_completion'], 0, 10) : null,
        ]);
        return $project;
    }
}
