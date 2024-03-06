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
                ->with('project_facilitys')
                ->with('status')
                ->with('project_delegations')
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
                $projects = $projectsQuery->paginate($args['queryOptions']['limit'], ['*'], 'page', $args['queryOptions']['page']);
            } else {
                $projects = $projectsQuery->get();
            }


            $projects->map(function ($project) {
                $data = [
                    'id' => $project->id,
                    'number' => $project->number,
                    'name' => $project->name,
                    'organization_customer' => null,
                    'type_project_document' => null,
                    'facilitys' => null,
                    'date_signing' => $project->date_signing,
                    'date_end' => $project->date_end,
                    'status' => null,
                    'date_completion' => $project->date_completion,
                    'delegates' => null,
                    'price' => $project->price,
                    'IRDs' => null,
                    'stages' => null,
                ];

                if ($project->organization_customer) {
                    $data['organization_customer'] = [
                        'id' => $project->organization_customer->id,
                        'name' => $project->organization_customer->name,
                    ];
                }

                if ($project->type_project_document) {
                    $data['type_project_document'] = [
                        'id' => $project->type_project_document->id,
                        'name' => $project->type_project_document->name,
                    ];
                }

                if ($project->facilitys) {
                    $data['facilitys'] = $project->facilitys->map(function ($facility) {
                        return [
                            'id' => $facility->id,
                            'name' => $facility->name,
                        ];
                    });
                }

                if ($project->status) {
                    $data['status'] = [
                        'id' => $project->status->id,
                        'name' => $project->status->name,
                    ];
                }

                if ($project->delegates) {
                    $data['delegates'] = $project->delegates->map(function ($delegate) {
                        return [
                            'id' => $delegate->id,
                            'first_name' => $delegate->first_name,
                            'last_name' => $delegate->last_name,
                            'patronymic' => $delegate->patronymic,
                        ];
                    });
                }

                if ($project->IRDs) {
                    $data['IRDs'] = $project->IRDs->map(function ($ird) {
                        return [
                            'id' => $ird->id,
                            'IRD' => [
                                'id' => $ird->IRD->id,
                                'name' => $ird->IRD->name,
                            ],
                            'received' => $ird->received,
                        ];
                    });
                }

                if ($project->stages) {
                    $data['stages'] = $project->stages->map(function ($stage) {
                        return [
                            'id' => $stage->id,
                            'stage' => [
                                'id' => $stage->stage->id,
                                'name' => $stage->stage->name,
                            ],
                            'date_start' => $stage->date_start,
                            'date_end' => $stage->date_end,
                            'persent' => $stage->persent,
                            'number' => $stage->number,
                        ];
                    });
                }

                return $data;
            })->toArray();
            return ['items' => $projects, 'count' =>  $count];
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
