<?php

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\TemplateIrdsTypeProjects; // Импорт модели
use App\Models\InitialAuthorizationDocumentation;
use Illuminate\Support\Facades\Log;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class TemplatesIrdsTypeProjects
{
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {

        $allowedRoles = ['admin'];
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            if($args['typeProject']){
            $tmItdTp = TemplateIrdsTypeProjects
                ::where('project_type_id', $args['typeProject'])
                ->with('type_project')
                ->with('ird')
                ->get();

            return $tmItdTp;}

        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
