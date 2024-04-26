<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\TemplateContentTypeProjects;


final readonly class TemplatesContentsTypeProjects
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        if (isset($args['typeProject'])) {
            $contentTamplate = TemplateContentTypeProjects::where('project_type_id', $args['typeProject'])->get();
            $idsTamplate = $contentTamplate->pluck('contents_id');
            $contects = Contents::whereIn('id', $idsTamplate)->get();

            return $contects;
        } else {
            return null;
        }
    }
}
