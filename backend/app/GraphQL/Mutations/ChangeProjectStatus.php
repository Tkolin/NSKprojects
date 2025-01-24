<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use function PHPUnit\Framework\throwException;

final readonly class ChangeProjectStatus
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $id = $args['projectId'];
        $statusKey = $args['statusKey'];
        $project = Project::find($id);
        $project->status_id = $statusKey;
        $project->save();
        return $project;
    }
}
