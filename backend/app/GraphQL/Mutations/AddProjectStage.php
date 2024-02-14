<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectStage;

final readonly class AddProjectStage
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args):ProjectStage
    {
        $projectStage = ProjectStage::create($args);
        return $projectStage;
    }
}
