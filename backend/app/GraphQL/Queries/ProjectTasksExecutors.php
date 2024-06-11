<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ProjectTaskExecutor;

final readonly class ProjectTasksExecutors
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $projectTaskExecutor = ProjectTaskExecutor::query();

        if (isset($args["taskId"])) {
            $projectTaskExecutor->where("task_id", $args["taskId"]);
        }

        return ['items' => $projectTaskExecutor->get(), 'count' => 0];
    }
}

