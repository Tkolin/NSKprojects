<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\InitialAuthorizationDocumentation;
use App\Models\Stage;
use App\Models\TemplateIrdsTypeProjects;
use App\Models\TemplateStagesTypeProjects;
use Illuminate\Support\Facades\Log;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class TemplatesStagesTypeProjects
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {

        $allowedRoles = ['admin'];
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            if($args['typeProject']) {
                return TemplateStagesTypeProjects
                    ::where('project_type_id', $args['typeProject'])
                    ->with('type_project')
                    ->with('stage')
                    ->get();
            }

        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}

