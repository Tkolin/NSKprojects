<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\TemplateSectionReference;
use App\Models\TemplateStagesTypeProjects;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class TemplatesSectionReferencesTypeProjects
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {

        $allowedRoles = ['admin', 'bookkeeper'];
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            if ($args['typeProject']) {
                return TemplateSectionReference
                    ::where('project_type_id', $args['typeProject'])
                    ->with('type_project')
                    ->with('section_reference')
                    ->get();
            }

        } else {
            throw new AuthenticationException('Отказано в доступе');

        }
    }
}
