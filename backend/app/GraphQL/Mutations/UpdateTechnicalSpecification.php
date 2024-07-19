<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\TechnicalSpecification;

final readonly class UpdateTechnicalSpecification
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args): TechnicalSpecification
    {
        return TechnicalSpecification::findOrFail($args['id'])->update($args["data"]);
    }
}
