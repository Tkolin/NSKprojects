<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\ProjectTaskExecutor;
use App\Models\ProjectTasks;
use App\Models\ProjectTasksInherited;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final class AddTaskToProject
{
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin', 'bookkeeper']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            $projectId = $args["projectId"];
            $task_id = $args["task_id"];
            $date_start = $args["date_start"];
            $date_end = $args["date_end"];
            $String = $args["String"];
            $duration = $args["duration"];
            $price = $args["price"];
            $executors = $args["executors"];
            $description = $args["description"];

            // Create ProjectTasks
            $projectTask = ProjectTasks::create([
                'task_id' => $task_id,
                'project_id' => $projectId,
                'price' => $price,
                'date_start' => $date_start,
                'date_end' => $date_end,
            ]);

            // Update or create ProjectTasksInherited
            $projectTaskInherited = ProjectTasksInherited::updateOrCreate(
                ['task_id' => $task_id, 'project_id' => $projectId],
                ['price' => $price, 'date_start' => $date_start, 'date_end' => $date_end]
            );

            // Update or create ProjectTaskExecutor for each executor
            foreach ($executors as $executor) {
                ProjectTaskExecutor::updateOrCreate(
                    ['task_id' => $task_id, 'project_id' => $projectId, 'executor_id' => $executor['executor_id']],
                    ['price' => $executor['price']]
                );
            }

            // Удаление записей, которых нет в списке
            ProjectTasksInherited::where('project_id', $projectId)
                ->whereNotIn('task_id', array_column($String, 'task_id'))
                ->delete();

            // Удаление записей, которых нет в списке
            ProjectTaskExecutor::where('project_id', $projectId)
                ->whereNotIn('executor_id', array_column($executors, 'executor_id'))
                ->delete();

            return 1;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
