<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Bank;
use App\Models\Bik;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class Banks
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
            $banksQuery = Bank::query();

            // Поиск
            if (isset($args['queryOptions']['search'])) {
                $searchTerm = $args['queryOptions']['search'];
                $banksQuery = $banksQuery
                    ->where('id', 'like', "%$searchTerm%")
                    ->orWhere('name', 'like', "%$searchTerm%");
            }

            // Получаем количество записей
            $count = $banksQuery->count();

            // Сортировка
            if (isset($args['queryOptions']['sortField']) && isset($args['queryOptions']['sortOrder'])) {
                $sortField = $args['queryOptions']['sortField'];
                $sortOrder = $args['queryOptions']['sortOrder'];
                $banksQuery = $banksQuery->orderBy($sortField, $sortOrder);
            }

            // Пагинация
            if (isset($args['queryOptions']['page'])) {
                $banks = $banksQuery->paginate($args['queryOptions']['limit'], ['*'], 'page', $args['queryOptions']['page']);
            } else {
                $banks = $banksQuery->get();
            }

            return ['items' => $banks, 'count' => $count];

    }
}
