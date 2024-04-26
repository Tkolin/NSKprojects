<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\TemplateStagesTypeProjects;

final readonly class TemplatesStagesTypeProjects
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
            if($args['typeProject']) {
                return TemplateStagesTypeProjects
                    ::where('project_type_id', $args['typeProject'])
                    ->with('type_project')
                    ->with('stage')
                    ->get();
            }
    }
}

