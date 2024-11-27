<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ProjectIrds;

final readonly class ProjectIrd
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['id']))
            throw new \Exception("The 'id' argument is required.");

        $modelId = $args['id'];
        return ProjectIrds::find($modelId);
    }
}
