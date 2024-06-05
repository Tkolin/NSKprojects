<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\TypeProjectDocument;

final readonly class CreateTypeProject
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
         return TypeProjectDocument::create($args);
    }
}
