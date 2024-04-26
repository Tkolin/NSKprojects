<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Bank;
use App\Services\GrpahQL\QueryService;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class Banks
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $banksQuery = Bank::query();

        $queryService = new QueryService();
        $searchColumns = ['id','name'];
        $banksQuery = $queryService->buildQueryOptions($banksQuery, $args['queryOptions'],$searchColumns);

        $count = $banksQuery->count();
        $banks = $queryService->paginate($banksQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
        return ['items' => $banks, 'count' => $count];

    }
}
