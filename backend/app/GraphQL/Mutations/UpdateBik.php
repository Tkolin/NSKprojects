<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Bik;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UpdateBik
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        return Bik::findOrFail($args['id'])->update($args);
    }
}
