<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Organization;
use App\Models\Position;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class PositionsTable
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $positionQuery = Position::query();

            // Поиск
            if (isset($args['search'])) {
                $searchTerm = $args['search'];
                $positionQuery = $positionQuery
                    ->where('name', 'like', "%$searchTerm%");
            }

            // Получаем количество записей
            $count = $positionQuery->count();

            if (isset($args['page'])) {
                $positions = $positionQuery->paginate($args['limit'], ['*'], 'page', $args['page']);
            } else {
                $positions = $positionQuery->get();
            }

            return ['positions' => $positions, 'count' => $count];
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
