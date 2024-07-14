<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ExecutorOrder;

final readonly class ProjectExecutorOrders
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if(!isset($args['queryOptions']))
            switch ($args['queryType']){
                case "COMPACT":
                    return ['items' => ExecutorOrder::all()];
                default:
                    return ['items' => "Ошибка, не верный тип запрооса"];
            }
        $query = ExecutorOrder::with("file");

        $queryService = new ExecutorOrder();
        $searchColumns = ['id','name'];
        $query = $queryService->buildQueryOptions($query, $args['queryOptions'],$searchColumns);

        $count = $query->count();
        $result = $queryService->paginate($query, $args['queryOptions']['limit'], $args['queryOptions']['page']);

        return $result;

    }
}
