<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Project as ModelsProject;

final readonly class Project
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $projectId = $args['id'];
        return   ModelsProject::find($args['id']);
    }
}
