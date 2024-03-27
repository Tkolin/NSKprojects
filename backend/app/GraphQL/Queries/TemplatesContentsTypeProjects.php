<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\InitialAuthorizationDocumentation;
use App\Models\TemplateContentTypeProjects;
use App\Models\TemplateIrdsTypeProjects;
use Illuminate\Support\Facades\Log;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class TemplatesContentsTypeProjects
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin','bookkeeper'];
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            if (isset($args['typeProject'])) {

                $contentTamplate = TemplateContentTypeProjects::where('project_type_id', $args['typeProject'])->get();
                $idsTamplate = $contentTamplate->pluck('contents_id');
                $contects = Contents::whereIn('id', $idsTamplate)->get();

                return $contects;
            } else {

                return null;
            }
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
