<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\InitialAuthorizationDocumentation;
use App\Services\GrpahQL\QueryService;

final readonly class Irds
{

    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $irdQuery = InitialAuthorizationDocumentation::query();

        $queryService = new QueryService();
        $searchColumns = ['id','name'];
        $irdQuery = $queryService->buildQueryOptions($irdQuery, $args['queryOptions'],$searchColumns);

        $count = $irdQuery->count();
        $irds = $queryService->paginate($irdQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
        return ['items' => $irds, 'count' => $count];
    }
}
