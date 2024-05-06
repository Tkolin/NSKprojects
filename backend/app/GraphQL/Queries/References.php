<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ReferenceModel;
use App\Services\GrpahQL\QueryService;

final readonly class References
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
//        $referencesQuery = ReferenceModel::query();
//
//        $queryService = new QueryService();
//        $searchColumns = ['id','name'];
//        $referencesQuery = $queryService->buildQueryOptions($referencesQuery, $args['queryOptions'],$searchColumns);
//
//        $count = $referencesQuery->count();
//        $references = $queryService->paginate($referencesQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
        //$references. = $queryService->paginate($referencesQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
        return ['items' => ReferenceModel::all(), 'count' => 1];

    }
}
