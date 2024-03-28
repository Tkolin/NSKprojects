<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\SectionReference;
use MongoDB\Driver\Exception\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class SectionReferences
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin','bookkeeper']; // Роли, которые разрешены

        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $query = SectionReference::query();

            // Поиск
            if (isset($args['queryOptions']['search'])) {
                $searchTerm = $args['queryOptions']['search'];
                $query = $query
                    ->where('name', 'like', "%$searchTerm%");
            }

            // Получаем количество записей
            $count = $query->count();

            // Сортировка
            if (isset($args['queryOptions']['sortField']) && isset($args['queryOptions']['sortOrder'])) {
                $sortField = $args['queryOptions']['sortField'];
                $sortOrder = $args['queryOptions']['sortOrder'];
                $query = $query->orderBy($sortField, $sortOrder);
            }

            // Пагинация
            if (isset($args['queryOptions']['page'])) {
                $items = $query->paginate($args['queryOptions']['limit'], ['*'], 'page', $args['queryOptions']['page']);
            } else {
                $items = $query->get();
            }



            return ['items' => $items, 'count' => $count];
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
