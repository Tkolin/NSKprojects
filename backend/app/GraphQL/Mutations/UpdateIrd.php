<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\InitialAuthorizationDocumentation;

final readonly class UpdateIrd
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $typeProjectDocument = InitialAuthorizationDocumentation::findOrFail($args['id']);
        $typeProjectDocument->update($args);
        return $typeProjectDocument;
    }
}
