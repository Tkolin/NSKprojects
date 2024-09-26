<?php declare(strict_types=1);

namespace App\GraphQL\Queries;
use App\Models\ProjectTSChapter;

final readonly class ProjectTS
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $projectTasks = ProjectTSChapter::with('values')
        ->get();

     return $projectTasks;
    }
}
