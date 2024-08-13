<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use App\Services\FileGenerate\FileDownloadService;
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
                ->with('type_project_document.group.technical_specification')
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

        $projectGenerator = new ProjectContractGeneratorService();

        $projectGenerator->generate($projectData, $dateCreateContract, true);
        $projectGenerator->generate($projectData, $dateCreateContract, false);

        $projectData = Project::with('project_contract_history')->find($args["projectId"]);

        return $projectData;
    }
}
