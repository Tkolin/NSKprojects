<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Task;
use App\Services\GrpahQL\QueryService;

final readonly class Tasks
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $tasksQuery = Task::query();

        $queryService = new QueryService();
        $searchColumns = ['id', 'name'];
        $tasksQuery = $queryService->buildQueryOptions($tasksQuery, $args['queryOptions'], $searchColumns);

        $count = $tasksQuery->count();
        $tasks = $queryService->paginate($tasksQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
        return ['items' => $tasks, 'count' => $count];
    }
}
