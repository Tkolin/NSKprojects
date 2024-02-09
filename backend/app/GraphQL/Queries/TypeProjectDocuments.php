<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\TypeProjectDocument;

final readonly class TypeProjectDocuments
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return TypeProjectDocument::all();
    }
}
