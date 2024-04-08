<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\ProjectTaskExecutor;
use App\Models\ProjectTasks;
use App\Models\ProjectTasksInherited;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UpdateTaskToProject
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin', 'bookkeeper']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            $id = $args["data"]["id"];
            $projectId = $args["data"]["projectId"];
            $task_id = $args["data"]["task_id"];
            $date_start = isset($args["data"]["date_start"]) ? substr((string) $args["data"]["date_start"], 0, 10) : null;
            $date_end = isset($args["data"]["date_end"]) ? substr((string) $args["data"]["date_end"], 0, 10) : null;
            $inherited_task_ids = $args["data"]["inherited_task_ids"];
            $price = $args["data"]["price"];
            $executors = $args["data"]["executors"];
            //$description = $args["data"]["description"];

            // Update ProjectTasks
            $projectTasks = ProjectTasks::where(['task_id' => $task_id, 'project_id' => $projectId])
                ->update(['price' => $price, 'date_start' => $date_start, 'date_end' => $date_end]);

            error_log("projectTasks ". $projectTasks);

            // Update or create ProjectTasksInherited
            foreach ($inherited_task_ids as $j) {
                ProjectTasksInherited::updateOrCreate(
                    ['project_task_id' => $id, 'project_inherited_task_id' => $j],
                    ['project_task_id' => $id, 'project_inherited_task_id' => $j]
                );
            }
            // Update or create ProjectTaskExecutor for each executor
//            foreach ($executors as $executor) {
//                ProjectTaskExecutor::updateOrCreate(
//                    ['task_id' => $task_id, 'project_id' => $projectId, 'executor_id' => $executor['executor_id']],
//                    ['price' => $executor['price']]
//                );
//            }

            // Удаление записей, которых нет в списке
            ProjectTasksInherited::where('project_task_id', $id)
                ->whereNotIn('project_inherited_task_id', array_column($inherited_task_ids, 'project_inherited_task_id'))
                ->delete();

            // Удаление записей, которых нет в списке
//            ProjectTaskExecutor::where('project_id', $projectId)
//                ->whereNotIn('executor_id', array_column($executors, 'executor_id'))
//                ->delete();

            return 1;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
