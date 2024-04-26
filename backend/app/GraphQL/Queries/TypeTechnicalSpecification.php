<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class TypeTechnicalSpecification
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        return \App\Models\TypeTechnicalSpecification::all();
    }
}
