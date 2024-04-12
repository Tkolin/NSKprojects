<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\ProjectTaskExecutor;
use App\Models\ProjectTasks;
use App\Models\ProjectTasksInherited;
use App\Models\Stage;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeleteTaskToProject
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            // Удалить все записи из таблицы ProjectTaskExecutor, где project_tasks_id равен args['id']
            ProjectTaskExecutor::where('project_tasks_id', $args['id'])->delete();

            // Удалить все записи из таблицы ProjectTasksInherited, где project_task_id равен args['id']
            ProjectTasksInherited::where('project_task_id', $args['id'])->delete();
            // Удалить все записи из таблицы ProjectTasksInherited, где project_task_id равен args['id']
            ProjectTasksInherited::where('project_inherited_task_id', $args['id'])->delete();

            // Удалить сущность ProjectTasks с указанным идентификатором
            ProjectTasks::destroy($args['id']);
            return "Успех";
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}

