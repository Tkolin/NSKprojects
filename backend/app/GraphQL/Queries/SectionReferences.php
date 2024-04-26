<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\SectionReference;
use App\Services\GrpahQL\QueryService;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class SectionReferences
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $sectionReferenceQuery = SectionReference::query();

        $queryService = new QueryService();
        $searchColumns = ['id', 'name'];
        $sectionReferenceQuery = $queryService->buildQueryOptions($sectionReferenceQuery, $args['queryOptions'], $searchColumns);

        $count = $sectionReferenceQuery->count();
        $sectionReference = $queryService->paginate($sectionReferenceQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
        return ['items' => $sectionReference, 'count' => $count];
    }
}
