<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Facility;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UpdateFacility
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args): Facility
    {
        return Facility::findOrFail($args['id'])->update($args);
    }
}
