<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ExecutorOrder;
use App\Models\Person;
use App\Models\Project;
use App\Models\ProjectTasks;
use App\Services\FileGenerate\TaskExecutorContractGeneratorService;

final readonly class GeneratedExecutorOrder
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

        if (!isset($projectTasksData))
            throw new \Exception('Неверно переданы данные');
        // Проверка все ли данные об одном
        $executorId = $projectTasksData[0]->executor_id;
        $projectId = $projectTasksData[0]->project_id;

        // Добор данных
        $projectData = Project::with('organization_customer')
            ->where('id', $projectId)
            ->first();

        error_log('======================================');

        error_log($projectData . ' $projectData->id');
        error_log($projectId . ' $projectId');

        $personData = Person::with(['passport', 'passport.passport_place_issue'])
            ->with('bank')
            ->with('BIK')
            ->where('id',$executorId,'id')
            ->first();

        error_log($personData . ' $personData->id');
        error_log($executorId . ' $executorId');
        error_log('======================================');

        $numberOrders = ExecutorOrder::whereHas('project_tasks', function ($query) use ($projectId) {
            $query->where('project_id', $projectId);
        })->count();

        error_log($numberOrders . ' $numberOrders');
        // Проверка данных
        if (!isset($projectData))
            throw new Exception('Проект не найден');
        if (!isset($personData))
            throw new Exception('Исполнитель не найден');

        // Генерация файла
        $projectGenerator = new TaskExecutorContractGeneratorService();
        $contractFilePath = $projectGenerator->generate($projectData, $personData, $projectTasksData,  $numberOrders);
        return ['url' => $contractFilePath];
    }
}
