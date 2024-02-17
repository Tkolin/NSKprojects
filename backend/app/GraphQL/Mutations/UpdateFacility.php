<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Facility;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UpdateFacility
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context): Facility
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            $facility = Facility::findOrFail($args['id']);
            $facility->update($args);
            return $facility;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }

    }
}
