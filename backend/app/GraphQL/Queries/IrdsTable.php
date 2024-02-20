<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Contact;
use App\Models\InitialAuthorizationDocumentation;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class IrdsTable
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены

        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $irdQuery = InitialAuthorizationDocumentation::query();

            // Поиск
            if (isset($args['search'])) {
                $searchTerm = $args['search'];
                $irdQuery = $irdQuery
                    ->where('name', 'like', "%$searchTerm%");
            }

            // Получаем количество записей
            $count = $irdQuery->count();

            // Сортировка
            if (isset($args['sortField']) && isset($args['sortOrder'])) {
                $sortField = $args['sortField'];
                $sortOrder = $args['sortOrder'];
                $irdQuery = $irdQuery->orderBy($sortField, $sortOrder);
            }

            // Пагинация
            if (isset($args['page'])) {
                $irds = $irdQuery->paginate($args['limit'], ['*'], 'page', $args['page']);
            } else {
                $irds = $irdQuery->get();
            }



            return ['irds' => $irds, 'count' => $count];
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
