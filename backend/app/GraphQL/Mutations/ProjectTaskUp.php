<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectTasks;

final readonly class ProjectTaskUp
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $taskId = $args["taskId"];
        $taskData = ProjectTasks::find($taskId);
        switch ($taskData->status) {
            case "NOT_EXECUTOR":
                $taskData->status = 'AWAITING';
                break;
            case "AWAITING":
                $taskData->status = 'WORKING';
                break;
            case "WORKING":
                $taskData->status = 'COMPLETED';
                break;
            case "COMPLETED":
                $taskData->status = 'COMPLETED';
                break;
        }
        $taskData->save();
        return $taskData;
    }
}
