<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

 use App\Models\ReferenceModel;
use App\Services\GrpahQL\QueryService;
use League\CommonMark\Reference\Reference;

final readonly class References //reference //references
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if(!isset($args['queryOptions']))
            switch ($args['queryType']){
                case "COMPACT":
                    return ['items' => ReferenceModel::all()];
                default:
                    return ['items' => "Ошибка, не верный тип запрооса"];
            }
        $referencesQuery = ReferenceModel::query();

        $queryService = new QueryService();
        $searchColumns = ['id','name'];
        $referencesQuery = $queryService->buildQueryOptions($referencesQuery, $args['queryOptions'],$searchColumns);

        $count = $referencesQuery->count();
        $referencess = $queryService->paginate($referencesQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);

        return ['items' => $referencess, 'count' => $count];
    }
}
