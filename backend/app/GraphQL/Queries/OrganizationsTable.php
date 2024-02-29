<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Organization;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class OrganizationsTable
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
            if (isset($args['search'])) {
                $searchTerm = $args['search'];
                $organizationsQuery = $organizationsQuery
                    ->where('name', 'like', "%$searchTerm%")
                    ->orWhere('full_name', 'like', "%$searchTerm%");
            }

            // Получаем количество записей
            $count = $organizationsQuery->count();

            // Сортировка
            if (isset($args['sortField']) && isset($args['sortOrder'])) {
                $sortField = $args['sortField'];
                $sortOrder = $args['sortOrder'];
                $organizationsQuery = $organizationsQuery->orderBy($sortField, $sortOrder);
            }

            if (isset($args['page'])) {
                $organizations = $organizationsQuery->paginate($args['limit'], ['*'], 'page', $args['page']);
            } else {
                $organizations = $organizationsQuery->get();
            }

            return ['organizations' => $organizations, 'count' => $count];


        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
