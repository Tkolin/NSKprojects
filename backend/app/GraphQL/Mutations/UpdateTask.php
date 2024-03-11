<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\InitialAuthorizationDocumentation;
use App\Models\Task;
use App\Models\TemplateStagesTypeProjects;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UpdateTask
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            // Проверка входных данных
            if (empty($args['names'])) {
                throw new \InvalidArgumentException('Names cannot be empty');
            }

            // Обновление или создание задач по массиву имен
            $affectedTasks  = collect($args['names'])->map(function ($name) {
                $task = Task::updateOrCreate(
                    ['name' => $name],
                    ['name' => $name]
                );
                // Возвращаем массив с идентификатором и именем задачи, если задача существует
                return $task ? ['id' => $task->id, 'name' => $task->name] : null;
            })->filter(); // Фильтруем null значения

            error_log($affectedTasks . "fdfd" );

            return $affectedTasks->all();
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }

    }
}
