<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Delay;

final readonly class ProjectDelay
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return Delay::query()->where("project_id", $args["projectId"])->get();

    }
}
