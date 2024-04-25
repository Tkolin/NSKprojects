<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\PasspotPlaceIssue;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UpdatePpi
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        return PasspotPlaceIssue::findOrFail($args['id'])->update($args);
    }
}
