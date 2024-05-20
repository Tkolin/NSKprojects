<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\TypeProjectDocument;
use App\Services\GrpahQL\QueryService;

final readonly class TypeProjects
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        if(!isset($args['queryOptions']))
            switch ($args['queryType']){
                case "COMPACT":
                    return ['items' => TypeProjectDocument::all()];
                default:
                    return ['items' => "Ошибка, не верный тип запрооса"];
            }
        $typeProjectsQuery = TypeProjectDocument::with(['group', 'group.technical_specification']);

        $queryService = new QueryService();
        $searchColumns = ['id','name','code'];
        $typeProjectsQuery = $queryService->buildQueryOptions($typeProjectsQuery, $args['queryOptions'],$searchColumns);

        $count = $typeProjectsQuery->count();
        $typeProjects = $queryService->paginate($typeProjectsQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
        return ['items' => $typeProjects, 'count' => $count];
    }
}
