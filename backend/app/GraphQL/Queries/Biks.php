<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Bik;
use App\Models\Contact;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class Biks
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin','bookkeeper']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $biksQuery = Bik::query();

            // Поиск
            if (isset($args['queryOptions']['search'])) {
                $searchTerm = $args['queryOptions']['search'];
                $biksQuery = $biksQuery
                    ->where('id', 'like', "%$searchTerm%")
                    ->orWhere('name', 'like', "%$searchTerm%")
                    ->orWhere('BIK', 'like', "%$searchTerm%")
                    ->orWhere('correspondent_account', 'like', "%$searchTerm%");
            }

            // Получаем количество записей
            $count = $biksQuery->count();

            // Сортировка
            if (isset($args['queryOptions']['sortField']) && isset($args['queryOptions']['sortOrder'])) {
                $sortField = $args['queryOptions']['sortField'];
                $sortOrder = $args['queryOptions']['sortOrder'];
                $biksQuery = $biksQuery->orderBy($sortField, $sortOrder);
            }

            // Пагинация
            if (isset($args['queryOptions']['page'])) {
                $biks = $biksQuery->paginate($args['queryOptions']['limit'], ['*'], 'page', $args['queryOptions']['page']);
            } else {
                $biks = $biksQuery->get();
            }



            return ['items' => $biks, 'count' => $count];
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }

    }
}
