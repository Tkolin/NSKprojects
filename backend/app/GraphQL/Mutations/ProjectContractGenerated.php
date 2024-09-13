<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use App\Models\ProjectFile;
use App\Services\FileGenerate\ProjectContractGeneratorService;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;

final readonly class ProjectContractGenerated
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $dateCreateContract = $args["dateCreateContract"];
        $projectData =
            Project::with('organization_customer')
                ->with('type_project_document')
                ->with('type_project_document.group')
                ->with('project_facilitys')
                ->with('status')
                ->with('project_delegations')
                ->with('project_irds.ird')
                ->with('project_stages.stage')
                ->find($args["projectId"]);

        if (!$projectData) {
            throw new AuthenticationException('Проект не найден');
        }
        if (!isset($projectData["organization_customer"])) {
            throw new AuthenticationException('Не указан закачзик');
        }
        $contractNumber = ProjectFile::where('type', "CONTRACT")
                ->where('project_id', $projectData->id)
                ->max('number') + 1;
        $value = [
            'projectData' => $projectData,
            'dateCreateContract' => $dateCreateContract,
            'contractNumber' => $contractNumber
        ];
        $projectGenerator = new ProjectContractGeneratorService(true);
        $projectGenerator->generate($value);

        $projectGenerator = new ProjectContractGeneratorService(false);
        $projectGenerator->generate($value);


        $projectData = Project::with('project_contract_history')->find($args["projectId"]);

        return $projectData;
    }
}
