<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;

final readonly class GeneratedCommercialOfferMessage
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $projectId = $args['projectId'];
        $dateMessage = $args['dateMessage'];
        $projectData = Project::find($projectId);
    }
}
