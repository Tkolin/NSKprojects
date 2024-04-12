<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\ProjectTaskExecutor;
use App\Models\ProjectTasks;
use App\Models\ProjectTasksInherited;
use DateTime;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final class AddTaskToProject
{
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin', 'bookkeeper']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            $projectId = $args["data"]["projectId"] ?? null;
            $task_id = $args["data"]["task_id"] ?? null;
            $date_start = isset($args["data"]["date_start"]) ? substr((string)$args["data"]["date_start"], 0, 10) : null;
            $date_end = isset($args["data"]["date_end"]) ? substr((string)$args["data"]["date_end"], 0, 10) : null;
            $inherited_task_ids = $args["data"]["inherited_task_ids"] ?? null;
            $price = $args["data"]["price"] ?? null;
            $executors = $args["data"]["executors"] ?? null;

            $startDate = new DateTime($date_start);
            $endDate = new DateTime($date_end);
            $duration = $startDate->diff($endDate)->days;

            $projectTasks = ProjectTasks::create([
                'price' => $price ?? null,
                'date_start' => $date_start ?? null,
                'date_end' => $date_end ?? null,
                'project_id' => $projectId ?? null,
                'task_id' => $task_id ?? null,
                'duration' => $duration + 1
            ]);

            if (isset($inherited_task_ids))
                foreach ($inherited_task_ids as $tasksInheritedId) {
                    ProjectTasksInherited::create([
                        'project_task_id' => $projectTasks->id ?? null,
                        'project_inherited_task_id' => $tasksInheritedId ?? null
                    ]);
                }

            if (isset($executors))
                foreach ($executors as $executor) {
                    ProjectTaskExecutor::create([
                        'project_tasks_id' => $projectTasks->id ?? null,
                        'executor_id' => $executor['executor_id'] ?? null,
                        'price' => $executor['price'] ?? null
                    ]);
                }
            return 1;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
