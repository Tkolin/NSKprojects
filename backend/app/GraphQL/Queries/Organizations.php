<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Organization;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class Organizations
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin','bookkeeper']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $organizationsQuery = Organization
                ::with('legal_form')
                ->with('contacts')
                ->with('Bik');

            // Поиск
            if (isset($args['queryOptions']['search'])) {
                $searchTerm = $args['queryOptions']['search'];
                $organizationsQuery = $organizationsQuery
                    ->where('name', 'like', "%$searchTerm%")
                    ->orWhere('full_name', 'like', "%$searchTerm%");
            }

            // Получаем количество записей
            $count = $organizationsQuery->count();

            // Сортировка
            if (isset($args['queryOptions']['sortField']) && isset($argsv['sortOrder'])) {
                $sortField = $args['queryOptions']['sortField'];
                $sortOrder = $args['queryOptions']['sortOrder'];
                $organizationsQuery = $organizationsQuery->orderBy($sortField, $sortOrder);
            }

            if (isset($args['queryOptions']['page'])) {
                $organizations = $organizationsQuery->paginate($args['queryOptions']['limit'], ['*'], 'page', $args['queryOptions']['page']);
            } else {
                $organizations = $organizationsQuery->get();
            }

            return ['items' => $organizations, 'count' => $count];


        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
