<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\TemplateContentTypeProjects;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use App\Models\ProjectPayment;
final readonly class PaymentsProjects
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin'];
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            if (isset($args['project'])) {

                $projectPayment = ProjectPayment::where('project_id', $args['project'])
                    ->with('project')
                    ->with('type_payment')
                    ->get();
                return $projectPayment;
            } else {
                return null;
            }
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
