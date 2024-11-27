<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ProjectStage as ModelsProjectStage;

final readonly class ProjectStage
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['id']))
            throw new \Exception("The 'id' argument is required.");

        $modelId = $args['id'];
        return ModelsProjectStage::find($modelId);
    }
}
