<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\InitialAuthorizationDocumentation;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class Irds
{

    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin','bookkeeper']; // Роли, которые разрешены

        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $irdQuery = InitialAuthorizationDocumentation::query();

            // Поиск
            if (isset($args['queryOptions']['search'])) {
                $searchTerm = $args['search'];
                $irdQuery = $irdQuery
                    ->where('name', 'like', "%$searchTerm%");
            }

            // Получаем количество записей
            $count = $irdQuery->count();

            // Сортировка
            if (isset($args['queryOptions']['sortField']) && isset($args['input']['sortOrder'])) {
                $sortField = $args['queryOptions']['sortField'];
                $sortOrder = $args['queryOptions']['sortOrder'];
                $irdQuery = $irdQuery->orderBy($sortField, $sortOrder);
            }

            // Пагинация
            if (isset($args['queryOptions']['page'])) {
                $irds = $irdQuery->paginate($args['queryOptions']['limit'], ['*'], 'page', $args['queryOptions']['page']);
            } else {
                $irds = $irdQuery->get();
            }



            return ['items' => $irds, 'count' => $count];
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
