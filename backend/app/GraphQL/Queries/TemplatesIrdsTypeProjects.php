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
        Log::info('мы в irds');

        $allowedRoles = ['admin'];
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            if (isset($args['typeProject'])) {
                // Используем метод where на модели TemplateIrdsTypeProjects
                $irdsTamplate = TemplateIrdsTypeProjects::where('project_type_id', $args['typeProject'])->get();
                Log::info('Found TemplateIrdsTypeProjects', ['count' => $irdsTamplate->count()]);

                $irdIds = $irdsTamplate->pluck('ird_id');
                Log::info('IRD IDs', ['irdIds' => $irdIds->toArray()]);

                $irds = InitialAuthorizationDocumentation::whereIn('id', $irdIds)->get();
                Log::info('Found InitialAuthorizationDocumentation', ['count' => $irds->count()]);


                return $irds;
            } else {
                Log::info('без typeProject Вернул всё');
                return null;
            }
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
