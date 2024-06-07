<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\TypeProjectDocument;

final readonly class UpdateTypeProject
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args): TypeProjectDocument
    {
        $typeProjectDocument = TypeProjectDocument::findOrFail($args['id']);
        $typeProjectDocument->update($args);
        return $typeProjectDocument;
    }
}
