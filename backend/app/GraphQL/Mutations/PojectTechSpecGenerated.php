<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;
use App\Services\FileGenerate\ProjectTechSpecGeneratorService;

final readonly class PojectTechSpecGenerated
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $projectData = Project::with('organization_customer')
        ->with('type_project_document')
        ->with('type_project_document.group')
        ->with('type_project_document.group.technical_specification')
        ->with('project_facilitys')
        ->with('status')
        ->with('project_delegations')
 
        ->find($args["projectId"]);


    if (!$projectData) {
        throw new Exception('Проект не найден');
    }
    if (!isset($args["dateGenerated"])) {
        throw new Exception('Дата создания не указана');
    }


    $techSpectGenerator = new ProjectTechSpecGeneratorService();

    $contractFilePath = $techSpec->generate([
        'projectData' => $projectData,
        '' => $args["stageNumber"] ?? -1,
        'dateGenerated' => $args["dateGenerated"],
    ]);


    return ['url' => $contractFilePath];
    }
}
