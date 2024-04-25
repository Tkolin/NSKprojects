<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Contact;
use App\Models\InitialAuthorizationDocumentation;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeleteIrd
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args): bool
    {
        InitialAuthorizationDocumentation::destroy($args['id']);
        return true;
    }
}
