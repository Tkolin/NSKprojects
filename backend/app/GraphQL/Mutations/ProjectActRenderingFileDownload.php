<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use App\Services\FileGenerate\TheActRenderingServicesTemplateGeneratorService;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class ProjectActRenderingFileDownload
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {

        $projectData = Project::with('organization_customer')
            ->with('type_project_document')
            ->with('type_project_document.group')
            ->with('project_facilitys')
            ->with('status')
            ->with('project_delegations')
            ->with('project_irds.ird')
            ->with('project_stages.stage')
            ->find($args["projectId"]);


        if (!$projectData) {
            throw new Exception('Проект не найден');
        }


        $projectGenerator = new TheActRenderingServicesTemplateGeneratorService();
        $contractFilePath = $projectGenerator->generate([
            'projectData' => $projectData,
            'stageNumber' => $args["stageNumber"],
            'dateCreated' => $args["dateGenerated"],
        ]);
        return ['url' => $contractFilePath];


    }
}
