<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Project;

final readonly class Projects
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return Project
            ::with('organization_customer')
            ->with('type_project_document')
            ->with('facility')
            ->with('status')
            ->get();
    }
}
