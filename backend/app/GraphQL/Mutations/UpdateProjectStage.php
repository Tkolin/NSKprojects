<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\ProjectStage;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UpdateProjectStage
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args): ProjectStage
    {
        return ProjectStage::findOrFail($args['id'])->update($args);
    }
}
