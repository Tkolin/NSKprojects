<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ProjectStage;

final readonly class ProjectStages
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['projectId']))
            throw new \Exception("The 'projectId' argument is required.");

        $data = ProjectStage::with('stage')
            ->orderBy('number') // Используем orderBy
            ->where('project_id', $args['projectId'])
            ->get();

        return $data;
    }
}
