<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Organization;
use App\Services\GrpahQL\QueryService;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use function React\Promise\all;

final readonly class Organizations
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        if(!isset($args['queryOptions']))
            switch ($args['queryType']){
                case "COMPACT":
                    return ['items' => Organization::all()];
                case "BY_ID":
                    if (!isset($args['id'])) {
                        return ['items' => 'Ошибка, отсутствует id'];
                    }
                    $data = Organization::find($args['id']);
                    if ($data) {
                        return ['items' => [$data]];
                    } else {
                        return ['items' => 'Ошибка, контакт не найден'];
                    }
                default:
                    return ['items' => "Ошибка, не верный тип запрооса"];
            }


        $organizationsQuery = Organization
            ::with('legal_form')
            ->with('bik');

        $queryService = new QueryService();
        $searchColumns = ['id', 'name', 'full_name'];
        $organizationsQuery = $queryService->buildQueryOptions($organizationsQuery, $args['queryOptions'], $searchColumns);

        $count = $organizationsQuery->count();
        $organizations = $queryService->paginate($organizationsQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);

        return ['items' => $organizations, 'count' => $count];
    }
}
