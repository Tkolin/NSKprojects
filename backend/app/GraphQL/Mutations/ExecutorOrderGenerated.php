<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Person;
use App\Models\Project;
use App\Models\ProjectTasks;
use App\Services\FileGenerate\TaskExecutorContractGeneratorService;

final readonly class ExecutorOrderGenerated
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        // Проверка на верность
        if (!isset($args['project_task_ids']))
            throw new \Exception('Неверно переданы данные');

        $projectTasksIds = $args['project_task_ids'];

        // Набор данных для задач
        $projectTasksData = ProjectTasks::with(['task', 'executor'])
            ->whereIn('id', $projectTasksIds)
            ->get();
        error_log($projectTasksData . '$projectTasksData[0]');

        if (!isset($projectTasksData))
            throw new \Exception('Неверно переданы данные');
        // Проверка все ли данные об одном
        $executorId = $projectTasksData[0]->executor_id;
        $projectId = $projectTasksData[0]->project_id;
//        foreach ($projectTasksData as $projectTask) {
//            if ($executorId != $projectTask->executor_id || $projectId != $projectTask->project_id) {
//                throw new Exception('Неверно переданы данные');
//            }
//        }

        // Добор данных
        $projectData = Project::with('organization_customer')
            ->find($projectId)
            ->get()
            ->first();


        $personData = Person::with(['passport', 'passport.passport_place_issue'])
            ->with('bank')
            ->with('BIK')
            ->find($executorId)
            ->get()
            ->first();


        // Проверка данных
        if (!isset($projectData))
            throw new Exception('Проект не найден');
        if (!isset($personData))
            throw new Exception('Исполнитель не найден');

        // Генерация файла
        $projectGenerator = new TaskExecutorContractGeneratorService();
        $contractFilePath = $projectGenerator->generate($projectData, $personData, $projectTasksData);
        return ['url' => $contractFilePath];

    }
}
