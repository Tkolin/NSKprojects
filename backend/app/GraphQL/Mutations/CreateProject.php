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
        // Создаем новый проект
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
        if (isset($project['id'])) {
            if (isset($args['data']['facilitys_id'])) {
                foreach ($args['data']['facilitys_id'] as $facilityId) {
                    ProjectFacilities::create([
                        'project_id' => $project['id'],
                        'facility_id' => $facilityId
                    ]);
                }
            }
            if (isset($args['data']['delegates_id'])) {
                foreach ($args['data']['delegates_id'] as $delegateId) {
                    ProjectDelegations::create([
                        'project_id' => $project['id'],
                        'delegation_id' => $delegateId
                    ]);
                }
            }
        }

        $tempStage = TemplateStagesTypeProjects
            ::where('project_type_id', $project->type_project_document_id)
            ->get();

        foreach ($tempStage as $key => $value) {
            ProjectStage::create(
                [
                    'project_id' => $project->id,
                    'stage_id' => $tempStage[$key]->stage_id,
                    'duration' => $tempStage[$key]->duration,
                    'percent' => $tempStage[$key]->percentage,
                    'number' => $tempStage[$key]->number,
                ]
            );
        }
        $tempTasks = TemplateTasksTypeProject
            ::where('project_type_id', $project->type_project_document_id)
            ->get();

        foreach ($tempStage as $key => $value) {
            ProjectTasks::create(
                [
                    'task_id' => $tempTasks[$key]->task_id,
                    'project_id' => $project->id,
                    'stage_number' => $tempTasks[$key]->stage_number,
                ]
            );
            if(isset($tempTasks[$key]->inherited_task_id)){
                ProjectTasksInherited::create(
                    [
                        'project_task_id' => $tempTasks[$key]->task_id,
                        'project_inherited_task_id' => $tempTasks[$key]->inherited_task_id,
                    ]
                );
            }
        }
        $tempIrd = TemplateIrdsTypeProjects
            ::where('project_type_id', $project->type_project_document_id)
            ->get();
        foreach ($tempIrd as $key => $value) {
            ProjectIrds::create(
                [
                    'project_id' => $project->id,
                    'ird_id' => $tempIrd[$key]->ird_id,
                    'stageNumber' => $tempIrd[$key]->stage_number,
                    'applicationProject' => $tempIrd[$key]->application_to_project,
                ]
            );
        }

        return $project;
    }
}
