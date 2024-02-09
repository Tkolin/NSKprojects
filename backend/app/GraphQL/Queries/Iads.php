<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\InitialAuthorizationDocumentation;

final readonly class Iads
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return InitialAuthorizationDocumentation::all();
    }
}
