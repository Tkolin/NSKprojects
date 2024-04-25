<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Contact;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeleteContact
{
    public function __invoke($_, array $args): bool
    {
        Contact::destroy($args['id']);
        return true;
    }
}
