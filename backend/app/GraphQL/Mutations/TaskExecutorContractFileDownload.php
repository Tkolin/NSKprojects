<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Person;
use App\Models\Project;
use App\Services\FileGenerate\TaskExecutorContractGeneratorService;
use Exception;

final readonly class TaskExecutorContractFileDownload
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {

        $projectData = Project::with('organization_customer')
            ->with('type_project_document')
            ->with('type_project_document.group')
            ->with('type_project_document.group.technical_specification')
             ->with('project_tasks')
            ->with('status')
            ->with('project_delegations')
            ->with('project_irds.IRD')
            ->with('project_stages.stage')
            ->find($args["projectId"]);


        $personData = Person::with(['passport', 'passport.passport_place_issue'])
            ->with('bank')
            ->with('BIK')
            ->find($args['executorId']);


        // projectId
        // executorId

        if (!$projectData) {
            throw new Exception('Проект не найден');
        }
        $executorId = $args['executorId'];
        $projectGenerator = new TaskExecutorContractGeneratorService();
        $contractFilePath = $projectGenerator->generate($projectData, $personData, $executorId);

        return ['url' => $contractFilePath];


    }
}
