<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Fenrir;

final readonly class CreateFenrir
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        Fenrir::create($args["data"]);
        return 1;
    }
}
