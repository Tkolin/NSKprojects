<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Facility;
use App\Models\SelectionFacility;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class Facilities
{
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            $data = SelectionFacility::with('subselection_facility.group_facility.facilities')
                ->get();
            error_log("fadf ". $data[2]);
            return $data;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
