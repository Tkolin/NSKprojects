<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\TechnicalSpecification;
use App\Models\TypeProjectDocument;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UpdateTechnicalSpecification
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args): TechnicalSpecification
    {
        return TechnicalSpecification::findOrFail($args['id'])->update($args);
    }
}
