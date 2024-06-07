<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Bik;
use App\Models\InitialAuthorizationDocumentation;

final readonly class UpdateBik
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $typeProjectDocument = Bik::findOrFail($args['id']);
        $typeProjectDocument->update($args);
        return $typeProjectDocument;
    }
}
