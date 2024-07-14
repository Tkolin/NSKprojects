<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ExecutorOrder;
use App\Models\PasspotPlaceIssue;
use App\Models\Project;
use App\Services\GrpahQL\QueryService;

final readonly class ExecutorOrders
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {

        $projectId = $args['projectId'];
        $executorId = $args['executorId'];

        // Найти проект
        $project = Project::find($projectId);

        if (!$project) {
            return [];
        }

        // Найти все задачи проекта с указанным исполнителем
        $projectTasks = $project->project_tasks()->where('executor_id', $executorId)->get();

        // Собрать все id задач
        $taskIds = $projectTasks->pluck('id')->toArray();

        // Найти все приказы, связанные с этими задачами
        $result = ExecutorOrder::whereHas('project_tasks', function ($query) use ($taskIds) {
            $query->whereIn('id', $taskIds);
        })->with("project_tasks")->get();

        return $result;

    }
}
