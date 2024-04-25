<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Stage;

final readonly class CreateStage
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return Stage::create($args);
    }
}
