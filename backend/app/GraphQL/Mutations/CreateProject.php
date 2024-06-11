<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use App\Models\ProjectDelegations;
use App\Models\ProjectFacilities;
use App\Models\ProjectIrds;
use App\Models\ProjectStage;
use App\Models\ProjectTasks;
use App\Models\ProjectTasksInherited;
use App\Models\TemplateIrdsTypeProjects;
use App\Models\TemplateStagesTypeProjects;
use App\Models\TemplateTasksTypeProject;
use App\Models\TypeProjectDocument;
use Illuminate\Support\Facades\DB;
use Exception;

final readonly class CreateProject
{
    /**
     * Создает новый проект на основе переданных данных и связывает его с указанными объектами.
     *
     * @param null $_
     * @param array $args
     * @return Project
     */
    public function __invoke(null $_, array $args): Project
    {
        return DB::transaction(function () use ($args) {
            ////////
            // Регистрация проекта
            ////////
            $project = Project::create([
                'number' => $args['data']['number'],
                'name' => $args['data']['name'] ?? null,
                'organization_customer_id' => $args['data']['organization_customer_id'] ?? null,
                'type_project_document_id' => $args['data']['type_project_document_id'] ?? null,
                'date_signing' => isset($args['data']['date_signing']) ? substr((string)$args['data']['date_signing'], 0, 10) : null,
                'duration' => $args['data']['duration'] ?? null,
                'date_end' => isset($args['data']['date_end']) ? substr((string)$args['data']['date_end'], 0, 10) : null,
                'date_create' => isset($args['data']['date_create']) ? substr((string)$args['data']['date_create'], 0, 10) : null,
                'status_id' => $args['data']['status_id'] ?? null,
                'prepayment' => $args['data']['prepayment'] ?? null,
                'date_completion' => isset($args['data']['date_completion']) ? substr((string)$args['data']['date_completion'], 0, 10) : null,
                'price' => $args['data']['price'] ?? null,
            ]);

            // Связываем проект с указанными объектами
            if ($project->id && isset($args['data']['facility_id'])) {
                foreach ($args['data']['facility_id'] as $facilityId) {
                    ProjectFacilities::updateOrCreate([
                        'project_id' => $project->id,
                        'facility_id' => $facilityId
                    ]);
                }
                ProjectFacilities::where('project_id', $project->id)
                    ->whereNotIn('facility_id', $args['data']['facility_id'])
                    ->delete();
            }

            ////////
            // Шаблоны
            ////////

            // Проверяем существуют ли требования к шаблонам
            if (isset($args["templates"]) || $project->type_project_document_id) {
                $projectTemplateId = $project->type_project_document->template_project_id ?? null;

                $templates = $args["templates"] ?? [
                    'stages' => [$projectTemplateId],
                    'irds' => [$projectTemplateId]
                ];

                if (!empty($templates["stages"])) {
                    $projectsIdsOrStageSearch = $templates["stages"];
                    $allTemplateStages = collect();
                    foreach ($projectsIdsOrStageSearch as $projectId) {
                        $allTemplateStages = $allTemplateStages->merge(ProjectStage::where('project_id', $projectId)->get());
                    }
                    foreach ($allTemplateStages as $projectStage) {
                        ProjectStage::create([
                            'project_id' => $project->id,
                            'stage_id' => $projectStage->stage_id,
                            'number' => $projectStage->number,
                            'duration' => $projectStage->duration,
                            'percent' => $projectStage->percent,
                        ]);
                    }
                }

                if (!empty($templates["irds"])) {
                    $projectsIdsOrIrdsSearch = $templates["irds"];
                    $allTemplateIrds = collect();
                    foreach ($projectsIdsOrIrdsSearch as $projectId) {
                        $allTemplateIrds = $allTemplateIrds->merge(ProjectIrds::where('project_id', $projectId)->get());
                    }
                    foreach ($allTemplateIrds as $projectIrd) {
                        ProjectIrds::create([
                            'stageNumber' => $projectIrd->stageNumber,
                            'applicationProject' => $projectIrd->applicationProject,
                            'project_id' => $project->id,
                            'ird_id' => $projectIrd->ird_id,
                        ]);
                    }
                }
            }

            return $project;
        });
    }

            //            $tempTasks = TemplateTasksTypeProject
            //                ::where('project_type_id', $project->type_project_document_id)
            //                ->get();
            //            if (isset($tempTasks) && $tempTasks->isNotEmpty())
            //                foreach ($tempStage as $key => $value) {
            //                    ProjectTasks::create(
            //                        [
            //                            'task_id' => $tempTasks[$key]->task_id ?? null,
            //                            'project_id' => $project->id ?? null,
            //                            'stage_number' => $tempTasks[$key]->stage_number ?? null,
            //                        ]
            //                    );
            //                    if (isset($tempTasks[$key]->inherited_task_id)) {
            //                        ProjectTasksInherited::create(
            //                            [
            //                                'project_task_id' => $tempTasks[$key]->task_id ?? null,
            //                                'project_inherited_task_id' => $tempTasks[$key]->inherited_task_id ?? null,
            //                            ]
            //                        );
            //                    }
            //                }
}
//
//
//            return $project;
//        });
//            }
//
//
//            return $project;
//        });
    //}
//}
