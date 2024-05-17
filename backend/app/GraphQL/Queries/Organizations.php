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
        if (!isset($args['queryOptions']))
            return ['items' => Organization::all()];


        $organizationsQuery = Organization
            ::with('legal_form')
            ->with('contacts')
            ->with('bik');

        $queryService = new QueryService();
        $searchColumns = ['id', 'name', 'full_name'];
        $organizationsQuery = $queryService->buildQueryOptions($organizationsQuery, $args['queryOptions'], $searchColumns);

        $count = $organizationsQuery->count();
        $organizations = $queryService->paginate($organizationsQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);

        return ['items' => $organizations, 'count' => $count];
    }
}
