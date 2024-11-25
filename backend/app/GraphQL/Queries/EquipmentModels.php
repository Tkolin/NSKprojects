<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\EquipmentModel;
use App\Services\GrpahQL\QueryService;

final readonly class EquipmentModels
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['queryOptions']))
            switch ($args['queryType']) {
                case "COMPACT":
                    return ['items' => EquipmentModel::all()];
                default:
                    return ['items' => "Ошибка, не верный тип запрооса"];
            }

        $stageQuery = EquipmentModel::query();
        error_log("stages " . $stageQuery->get());

        $queryService = new QueryService();
        $searchColumns = ['id', 'name'];
        $stageQuery = $queryService->buildQueryOptions($stageQuery, $args['queryOptions'], $searchColumns);

        $count = $stageQuery->count();
        $data = $queryService->paginate($stageQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
        return ['items' => $data, 'count' => $count];
    }
}
