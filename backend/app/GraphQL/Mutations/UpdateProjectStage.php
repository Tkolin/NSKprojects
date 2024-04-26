<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectStage;

final readonly class UpdateProjectStage
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args): ProjectStage
    {
        return ProjectStage::findOrFail($args['id'])->update($args);
    }
}
