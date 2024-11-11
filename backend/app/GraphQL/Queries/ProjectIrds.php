<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

 
final readonly class ProjectIrds
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['projectId'])) {
            throw new \Exception("The 'projectId' argument is required.");
        }

        return \App\Models\ProjectIrds::where('project_id', '=', $args['projectId'])->get();
    }
}
