<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\InitialAuthorizationDocumentation;
use App\Models\Stage;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UpdateStage
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return Stage::findOrFail($args['id'])->update($args);
    }
}
