<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\TypeProjectDocument;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class TypeProjects
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $tpds = TypeProjectDocument::query();

            // Поиск
            if (isset($args['queryOptions']['search'])) {
                $searchTerm = $args['queryOptions']['search'];
                $tpds = $tpds
                    ->where('name', 'like', "%$searchTerm%")
                    ->orWhere('code', 'like', "%$searchTerm%");
            }

            // Получаем количество записей
            $count = $tpds->count();

            // Сортировка
            if (isset($args['queryOptions']['sortField']) && isset($args['queryOptions']['sortOrder'])) {
                $sortField = $args['queryOptions']['sortField'];
                $sortOrder = $args['queryOptions']['sortOrder'];
                $tpds = $tpds->orderBy($sortField, $sortOrder);
            }

            if (isset($args['queryOptions']['page'])) {
                $tpd = $tpds->paginate($args['queryOptions']['limit'], ['*'], 'page', $args['queryOptions']['page']);
            } else {
                $tpd = $tpds->get();
            }

            return ['items' => $tpd, 'count' => $count];


        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
