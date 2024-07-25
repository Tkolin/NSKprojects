<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Organization;

final readonly class CountProjectByOrganizations
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $organizationId = $args['organizationId'] ?? null;

        if ($organizationId) {
            $organization = Organization::withCount('project')->find($organizationId);
            if (!$organization) {
                throw new \Exception("Organization not found");
            }
            return $organization->project_count;
        }

        throw new \Exception("Organization not found");
    }
}
