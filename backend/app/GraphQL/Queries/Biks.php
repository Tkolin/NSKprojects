<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Bik;
use App\Services\GrpahQL\AuthorizationService;
use App\Services\GrpahQL\QueryService;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class Biks
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        if(!isset($args['queryOptions']))
            switch ($args['queryType']){
                case "COMPACT":
                    return ['items' => Bik::all()];
                default:
                    return ['items' => "Ошибка, не верный тип запрооса"];
            }
        $biksQuery = Bik::query();

        $queryService = new QueryService();
        $searchColumns = ['id', 'name', 'BIK', 'correspondent_account'];
        $biksQuery = $queryService->buildQueryOptions($biksQuery, $args['queryOptions'], $searchColumns);

        $count = $biksQuery->count();
        $biks = $queryService->paginate($biksQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
        return ['items' => $biks, 'count' => $count];

    }
}
