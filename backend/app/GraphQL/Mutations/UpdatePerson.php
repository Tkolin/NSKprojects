<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Person;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UpdatePerson
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context): Person
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            $person = Person::findOrFail($args['id']);
            $person->update($args);
            return $person;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }

    }
}
