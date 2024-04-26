<?php

namespace App\GraphQL\Queries;

use App\Models\TemplateIrdsTypeProjects;

final readonly class TemplatesIrdsTypeProjects
{
    public function __invoke(null $_, array $args)
    {
        if ($args['typeProject']) {
            return TemplateIrdsTypeProjects
                ::where('project_type_id', $args['typeProject'])
                ->with('type_project')
                ->with('ird')
                ->get();
        }
    }
}
