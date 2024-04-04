<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\ProjectTaskExecutor;
use App\Models\ProjectTasks;
use App\Models\ProjectTasksInherited;
use App\Models\Stage;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class AddTaskToProject
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin', 'bookkeeper']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {


           // $id = $args["id"];
            $projectId = $args["projectId"];
            $inherited_task_ids = $args["inherited_task_ids"];
            $task_id = $args["task_id"];
            $date_start = $args["date_start"];
            $date_end = $args["date_end"];
            $String = $args["String"];
            $duration = $args["duration"];
            $price = $args["price"];
            $executors = $args["executors "];
            $description = $args["description"];

            $TaskExecutor = $args["TaskExecutor"];
                                                    // id
                                                    // executor_id
                                                    // price

            $pt = ProjectTasks::create([
                // $id = $args["id"];
                'task_id' => $args["task_id"],
                'project_id' => $args["projectId"],
                'price' => $args["price"],
                'date_start' => $args["date_start"],
                'date_end' => $args["date_end"],

            ]);
            //   'inherited_task_ids' = $args["inherited_task_ids"],
            //     "duration" = $args["duration"],
            //    'executors' = $args["executors "],
            //    'description' = $args["description"],
            $pti = ProjectTasksInherited::updateOrCreate([
                // $id = $args["id"];
                'task_id' => $args["task_id"],
                'project_id' => $args["projectId"],
                'price' => $args["price"],
                'date_start' => $args["date_start"],
                'date_end' => $args["date_end"],

            ],[

            ]);
            $pte = ProjectTaskExecutor::updateOrCreate([
                // $id = $args["id"];
                'task_id' => $args["task_id"],
                'project_id' => $args["projectId"],
                'price' => $args["price"],
                'date_start' => $args["date_start"],
                'date_end' => $args["date_end"],
            ],
            [

            ]);
            // Удаление записей, которых нет в списке
            ProjectTasksInherited::where('project_type_id', $typeProjectId)
                ->whereNotIn('task_id', $listTasksId)
                ->delete();

            // Удаление записей, которых нет в списке
            ProjectTaskExecutor::where('project_type_id', $typeProjectId)
                ->whereNotIn('task_id', $listTasksId)
                ->delete();
            return 1;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
