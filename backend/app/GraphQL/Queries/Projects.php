<?php

namespace App\GraphQL\Queries;
use App\Models\Project;
use App\GraphQL\Service\AuthorizationService;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class Projects
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {



            $projectsQuery = Project::with('organization_customer')
                ->with('type_project_document')
                ->with("delegations")
                ->with('project_facilitys')
                ->with('status')
                ->with('delegations')
                ->with('project_irds.IRD')
                ->with('project_stage.stage');
            // Поиск
            if (isset($args['queryOptions']['search'])) {
                $searchTerm = $args['queryOptions']['search'];
                $projectsQuery = $projectsQuery->where('number', 'like', "%$searchTerm%")
                    ->orWhere('name', 'like', "%$searchTerm%")
                    ->orWhere('organization_customer_id', 'like', "%$searchTerm%")
                    ->orWhere('type_project_document_id', 'like', "%$searchTerm%")
                    ->orWhere('facility_id', 'like', "%$searchTerm%")
                    ->orWhere('date_signing', 'like', "%$searchTerm%")
                    ->orWhere('duration', 'like', "%$searchTerm%")
                    ->orWhere('date_end', 'like', "%$searchTerm%")
                    ->orWhere('status_id', 'like', "%$searchTerm%")
                    ->orWhere('date_completion', 'like', "%$searchTerm%")
                    ->orWhere('delegate_id', 'like', "%$searchTerm%");
            }

            // Получаем количество записей
            $count = $projectsQuery->count();

            // Сортировка
            if (isset($args['queryOptions']['sortField']) && isset($args['queryOptions']['sortOrder'])) {
                $sortField = $args['queryOptions']['sortField'];
                $sortOrder = $args['queryOptions']['sortOrder'];
                $projectsQuery = $projectsQuery->orderBy($sortField, $sortOrder);
            }

            // Пагинация
            if (isset($args['queryOptions']['page'])) {
                $projects = $projectsQuery->paginate(1, ['*'], 'page', $args['queryOptions']['page']);
            } else {
                $projects = $projectsQuery->get();
            }


            return ['items' => $projects, 'count' =>  $count];
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
