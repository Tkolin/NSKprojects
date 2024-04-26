<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\TemplateSectionReference;


final readonly class TemplatesSectionReferencesTypeProjects
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
            if ($args['typeProject']) {
                return TemplateSectionReference
                    ::where('project_type_id', $args['typeProject'])
                    ->with('type_project')
                    ->with('section_reference')
                    ->get();
            }
    }
}
