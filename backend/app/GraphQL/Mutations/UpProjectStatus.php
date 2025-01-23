<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use App\Services\FileGenerate\FormatterService;
use Exception;

final class UpProjectStatus
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $statuses = [
            1 => 'DESIGN_REQUEST',
            2 => 'APPROVAL_KP',
            3 => 'APPROVAL_AGREEMENT',
            4 => 'WORKING',
            5 => 'COMPLETED'
        ];

        $id = $args['projectId'];
        $project = Project::find($id);

        if (!$project) {
            throw new Exception("Project not found.");
        }

        $statusKey = $project->status_id;

        // Найти ключ текущего статуса
        $key = array_search($statusKey, $statuses);
        // Здесь ваша логика генерации номера проекта


        if (isset($key)) {
            // Проверить, не является ли это последним элементом массива
            if (isset($statuses[$key + 1])) {
                $project->status_id = $statuses[$key + 1];
            } else {
                $project->status_id = "ARCHIVE"; // ID статуса ARCHIVE
            }

            // Если статус сменяется на WORKING, выполняем доп. логику
            if ($project->status_id === "WORKING") {
                $project->date_start = date('Y-m-d');
            }
            if ($project->status_id === "APPROVAL_AGREEMENT" && !isset($project->number)) {
                $facilityA = $project->facilities->first();
                $facilityB = $facilityA->facility_group;
                $facilityC = $facilityB->facility_subselection;
                $facilityD = $facilityC->facility_selection;
                $facilityCode =
                    FormatterService::formatWithLeadingZeros($facilityD->code, 2) . '-' .
                    FormatterService::formatWithLeadingZeros($facilityC->code, 2) . '-' .
                    FormatterService::formatWithLeadingZeros($facilityB->code, 3) . '-' .
                    FormatterService::formatWithLeadingZeros($facilityA->code, 3);
                $organizationCustomer = str_pad((string) $project->organization_customer_id, 3, '0', STR_PAD_LEFT);
                $groupTypeCode = $project->type_project_document->group->code ?? "___";
                // Убедитесь, что у вас есть счетчик проектов по организации
                $projectCount = $project->organization_customer->project()->count();
                $projectNumber = $groupTypeCode . '–24–' . str_pad((string) $projectCount, 2, '0', STR_PAD_LEFT) . '–' . $organizationCustomer . '–' . $facilityCode;

                $project->number = $projectNumber;
                $project->path_project_folder = $projectNumber;
            }
            if ($project->status_id === "COMPLETED") {
                $project->date_completion = date('Y-m-d');
            }
            $project->save();
            return $project;
        } else {
            throw new Exception("Status not found in the list.");
        }
    }


}
