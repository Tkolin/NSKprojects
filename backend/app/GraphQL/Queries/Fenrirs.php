<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Fenrir;
use App\Services\GrpahQL\QueryService;

final readonly class Fenrirs
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return ['items' => Fenrir::all(), 'count' => 1];

//        $fenrirsQuery = Fenrir::with('position')->with('organization');
//
//        $queryService = new QueryService();
//        $searchColumns = ['id', 'first_name', 'last_name', 'patronymic', 'work_phone', 'work_email', 'mobile_phone', 'email'];
//        $fenrirsQuery = $queryService->buildQueryOptions($fenrirsQuery, $args['queryOptions'], $searchColumns);
//
//        $count = $fenrirsQuery->count();
//        $fenrirs = $queryService->paginate($fenrirsQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
    }
}
