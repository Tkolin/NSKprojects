<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Organization;
use App\Models\TypeProjectDocument;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class TypeProjectsTable
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $tpds = TypeProjectDocument::query();

            // Поиск
            if (isset($args['search'])) {
                $searchTerm = $args['search'];
                $tpds = $tpds
                    ->where('name', 'like', "%$searchTerm%");
            }

            // Получаем количество записей
            $count = $tpds->count();

            // Сортировка
            if (isset($args['sortField']) && isset($args['sortOrder'])) {
                $sortField = $args['sortField'];
                $sortOrder = $args['sortOrder'];
                $tpds = $tpds->orderBy($sortField, $sortOrder);
            }

            if (isset($args['page'])) {
                $tpd = $tpds->paginate($args['limit'], ['*'], 'page', $args['page']);
            } else {
                $tpd = $tpds->get();
            }

            return ['typeProjects' => $tpd, 'count' => $count];


        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
