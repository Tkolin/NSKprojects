<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Organization;
use App\Services\GrpahQL\QueryService;

final readonly class OrganizationsAndEmployee
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $organizationsQuery = Organization
            ::with('legal_form')
            ->with('employees')
            ->with('bik');

        $queryService = new QueryService();
        $searchColumns = ['id', 'name', 'full_name'];
        $organizationsQuery = $queryService->buildQueryOptions($organizationsQuery, $args['queryOptions'], $searchColumns);

        $count = $organizationsQuery->count();
        $organizations = $queryService->paginate($organizationsQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);

        return ['items' => $organizations, 'count' => $count];
    }
}
