<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Position;
use App\Services\GrpahQL\QueryService;

final readonly class Positions
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        if(!isset($args['queryOptions']))
            return ['items' => Position::all()];

        $positionQuery = Position::query();

        $queryService = new QueryService();
        $searchColumns = ['id','name'];
        $positionQuery = $queryService->buildQueryOptions($positionQuery, $args['queryOptions'],$searchColumns);

        $count = $positionQuery->count();
        $positions = $queryService->paginate($positionQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
        return ['items' => $positions, 'count' => $count];
    }
}
