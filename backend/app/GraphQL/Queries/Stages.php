<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Stage;
use App\Services\GrpahQL\QueryService;

final readonly class Stages
{
    public function __invoke(null $_, array $args)
    {
        if(!isset($args['queryOptions']))
            switch ($args['queryType']){
                case "COMPACT":
                    return ['items' => Stage::all()];
                default:
                    return ['items' => "Ошибка, не верный тип запрооса"];
            }
        $stageQuery = Stage::query();

        $queryService = new QueryService();
        $searchColumns = ['id','name'];
        $stageQuery = $queryService->buildQueryOptions($stageQuery, $args['queryOptions'],$searchColumns);

        $count = $stageQuery->count();
        $stages = $queryService->paginate($stageQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
        return ['items' => $stages, 'count' => $count];
    }
}
