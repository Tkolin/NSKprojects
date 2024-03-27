<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\TemplateStagesTypeProjects;
use App\Models\TemplateTasksTypeProject;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class TemplatesTasksTypeProjects
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {

        $allowedRoles = ['admin','bookkeeper'];
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            if($args['typeProject']) {
                return TemplateTasksTypeProject
                    ::where('project_type_id', $args['typeProject'])
                    ->with('type_project')
                    ->with('task')
                    ->with('inheritedTask')
                    ->get();
            }

        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
