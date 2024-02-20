<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\InitialAuthorizationDocumentation;
use App\Models\Stage;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class StagesTable
{
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены

        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $stageQuery = Stage::query();

            // Поиск
            if (isset($args['search'])) {
                $searchTerm = $args['search'];
                $stageQuery = $stageQuery
                    ->where('name', 'like', "%$searchTerm%");
            }

            // Получаем количество записей
            $count = $stageQuery->count();

            // Сортировка
            if (isset($args['sortField']) && isset($args['sortOrder'])) {
                $sortField = $args['sortField'];
                $sortOrder = $args['sortOrder'];
                $stageQuery = $stageQuery->orderBy($sortField, $sortOrder);
            }

            // Пагинация
            if (isset($args['page'])) {
                $stages = $stageQuery->paginate($args['limit'], ['*'], 'page', $args['page']);
            } else {
                $stages = $stageQuery->get();
            }



            return ['stages' => $stages, 'count' => $count];
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
