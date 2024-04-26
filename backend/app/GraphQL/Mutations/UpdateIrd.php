<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\InitialAuthorizationDocumentation;

final readonly class UpdateIrd
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
            return InitialAuthorizationDocumentation::findOrFail($args['id'])->update($args);
    }
}
