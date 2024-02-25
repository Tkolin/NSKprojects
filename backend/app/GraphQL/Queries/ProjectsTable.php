<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\InitialAuthorizationDocumentation;
use App\Models\Project;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class ProjectsTable
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $projectsQuery = Project::with('organization_customer')
                ->with('type_project_document')
                ->with('facility')
                ->with('status')
                ->with('delegate');

            // Поиск
            if (isset($args['search'])) {
                $searchTerm = $args['search'];
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
            if (isset($args['sortField']) && isset($args['sortOrder'])) {
                $sortField = $args['sortField'];
                $sortOrder = $args['sortOrder'];
                $projectsQuery = $projectsQuery->orderBy($sortField, $sortOrder);
            }

            // Пагинация
            if (isset($args['page'])) {
                $projects = $projectsQuery->paginate($args['limit'], ['*'], 'page', $args['page']);
            } else {
                $projects = $projectsQuery->get();
            }



            return ['projects' => $projects, 'count' => $count];
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
