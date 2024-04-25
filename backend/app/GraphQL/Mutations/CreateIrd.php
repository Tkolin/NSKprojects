<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\InitialAuthorizationDocumentation;

final readonly class CreateIrd
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return InitialAuthorizationDocumentation::create($args);
    }
}
