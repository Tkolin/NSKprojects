<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\TechnicalSpecification;

final readonly class CreateTechnicalSpecification
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $data = $args["data"];
        return TechnicalSpecification::create($data);
    }
}
