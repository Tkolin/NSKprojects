<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Facility;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class Facilities
{
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            $data = Facility::with(  'group_facility.subselection_facility')
                ->with('group_facility.subselection_facility')
                ->get();

            error_log("dsad ".$data[43]);

            return $data;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
