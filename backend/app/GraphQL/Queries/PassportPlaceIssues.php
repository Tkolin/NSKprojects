<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\PasspotPlaceIssue;
use App\Services\GrpahQL\QueryService;

final readonly class PassportPlaceIssues
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if(!isset($args['queryOptions']))
            switch ($args['queryType']){
                case "COMPACT":
                    return ['items' => PasspotPlaceIssue::all()];
                default:
                    return ['items' => "Ошибка, не верный тип запрооса"];
            }
        $ppiQuery = PasspotPlaceIssue::query();

        $queryService = new QueryService();
        $searchColumns = ['id','name'];
        $ppiQuery = $queryService->buildQueryOptions($ppiQuery, $args['queryOptions'],$searchColumns);

        $count = $ppiQuery->count();
        $ppis = $queryService->paginate($ppiQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
        return ['items' => $ppis, 'count' => $count];
    }
}
