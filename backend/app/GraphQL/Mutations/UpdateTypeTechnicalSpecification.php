<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\TechnicalSpecification;
use App\Models\TypeTechnicalSpecification;

final readonly class UpdateTypeTechnicalSpecification
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args): TechnicalSpecification
    {
        return TypeTechnicalSpecification::findOrFail($args['id'])->update($args);

    }
}
