<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectTaskExecutor;

final class UpdateEmployeesToTasks
{
    /** @param array{} $args */
    public function __invoke($_, array $args)
    {
        $tasksIds = $args["tasksIds"];
        $employeesIds = $args["employeesIds"];

        $count = count($tasksIds);

        for ($i = 0; $i < $count; $i++) {

            for ($j = 0; $j < count($employeesIds); $j++) {
                error_log('emp: '.$j.' task: '.$i." = ".$employeesIds[$j]." - ".$tasksIds[$i]);

                ProjectTaskExecutor::updateOrCreate(
                    [
                        'project_tasks_id' => $tasksIds[$i],
                    ],
                    [
                        'project_tasks_id' => $tasksIds[$i],
                        'executor_id' => (int)$employeesIds[$j],
                    ]
                );
            }
        }

//        // Удаление записей, которых нет в списке
//        ProjectTaskExecutor::whereIn('project_tasks_id', $tasksIds)
//            ->whereNotIn('executor_id', $employeesIds)
//            ->delete();

        return ProjectTaskExecutor::whereIn('project_tasks_id', $tasksIds)->get();
    }
}
