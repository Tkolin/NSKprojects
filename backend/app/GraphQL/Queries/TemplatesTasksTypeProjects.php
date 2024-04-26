<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\TemplateTasksTypeProject;

final readonly class TemplatesTasksTypeProjects
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        if ($args['typeProject']) {
            return TemplateTasksTypeProject
                ::where('project_type_id', $args['typeProject'])
                ->with('type_project')
                ->with('task')
                ->with('inheritedTask')
                ->get();
        }
    }
}
