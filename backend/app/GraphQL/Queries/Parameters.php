<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ParameterModel;
use App\Services\GrpahQL\QueryService;

final readonly class Parameters
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['queryOptions']))
            switch ($args['queryType']) {
                case "COMPACT":
                    return ['items' => ParameterModel::all()];
                case "BY_ID":
                    if (!isset($args['id'])) {
                        return ['items' => 'Ошибка, отсутствует id'];
                    }
                    $data = ParameterModel::find($args['id']);
                    if ($data) {
                        return ['items' => [$data]];
                    } else {
                        return ['items' => 'Ошибка, контакт не найден'];
                    }
                default:
                    return ['items' => "Ошибка, не верный тип запрооса"];
            }


        $parametersQuery = ParameterModel::query();

        $queryService = new QueryService();
        $searchColumns = ['id', 'name', 'min', 'max'];
        $parametersQuery = $queryService->buildQueryOptions($parametersQuery, $args['queryOptions'], $searchColumns);

        $count = $parametersQuery->count();
        $parameters = $queryService->paginate($parametersQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);

        return ['items' => $parameters, 'count' => $count];
    }
}
