<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Stage;
use App\Models\Task;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class TasksTable
{
    /** @param  array{}  $args */
    public function __invoke(null $_,array $args,  GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены

        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $tasksQuery = Task::query();
            error_log("Вот так:");
            // Поиск
            if (isset($args['search'])) {
                $searchTerm = $args['search'];
                $tasksQuery = $tasksQuery
                    ->where('name', 'like', "%$searchTerm%");
            }

            // Получаем количество записей
            $count = $tasksQuery->count();

            // Сортировка
            if (isset($args['sortField']) && isset($args['sortOrder'])) {
                $sortField = $args['sortField'];
                $sortOrder = $args['sortOrder'];
                $tasksQuery = $tasksQuery->orderBy($sortField, $sortOrder);
            }

            // Пагинация
            if (isset($args['page'])) {
                $tasks = $tasksQuery->paginate($args['limit'], ['*'], 'page', $args['page']);
            } else {
                $tasks = $tasksQuery->get();
            }



            return ['tasks' => $tasks, 'count' => $count];
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
