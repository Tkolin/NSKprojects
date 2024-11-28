<?php

namespace App\Http\Controllers\FileUpload;

use App\Http\Controllers\Controller;
use App\Models\File;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\ProjectStage as ProjectStageModel;
use App\Services\FileUpload\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectStage extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function uploadWorkActSinging(Request $request)
    {
        $projectId = $request->query('projectId');
        $stageNumber = $request->query('stageNumber');
        $datePayment = $request->query('date');
        $file = $this->fileUploadService->validateAndGetFile($request);

        $projectStage = $this->findProjectStage($projectId, $stageNumber);

        $project = $projectStage->project;

        $fileRecord = $this->fileUploadService->uploadFile(
            $file,
            '/' . $project->path_project_folder . '/Счета на оплату (подтверждённые)/',
            'localERPFiles'
        );

        $orderNumber = $this->generateOrderNumber($project, $projectStage);

        $this->fileUploadService->createProjectFile($projectId, $fileRecord->id, 'STAGE_WORK_ACT', $datePayment, $orderNumber);
        error_log("ss" . $projectStage);

        DB::update(
            'UPDATE project_stages
         SET work_act_file_id = ?, work_act_singing_date = ?, updated_at = NOW()
         WHERE project_id = ? AND stage_id = ?',
            [$fileRecord->id, $datePayment, $projectId, $projectStage->stage_id]
        );


        return response()->json(['success' => true, 'file' => $fileRecord->id]);
    }

    public function uploadPaymentInvoice(Request $request)
    {
        $projectId = $request->query('projectId');
        $stageNumber = $request->query('stageNumber');
        $datePayment = $request->query('date');
        $file = $request->file('file'); // Проверяем, есть ли файл в запросе

        if ($stageNumber === '0') {
            // Работа с проектом без этапа
            $project = Project::findOrFail($projectId);

            if ($file) {
                // Если файл передан, выполняем загрузку
                $fileRecord = $this->fileUploadService->uploadFile(
                    $file,
                    '/' . $project->path_project_folder . '/Счета на оплату (подтверждённые)/',
                    'localERPFiles'
                );

                $orderNumber = $this->generateOrderNumber($project);

                $this->fileUploadService->createProjectFile($project->id, $fileRecord->id, 'STAGE_PAYMENT', $datePayment, $orderNumber);

                $project->update([
                    'prepayment_date' => $datePayment,
                    'prepayment_file_id' => $fileRecord->id,
                ]);

                return response()->json(['success' => true, 'file' => $fileRecord->id]);
            } else {
                // Если файл не передан, обновляем только дату
                $project->update([
                    'prepayment_date' => $datePayment,
                ]);

                return response()->json(['success' => true, 'message' => 'Payment date updated without file.']);
            }
        } else {
            // Работа с этапом проекта
            $projectStage = $this->findProjectStage($projectId, $stageNumber);

            if (!$projectStage) {
                return response()->json(['error' => 'Project stage not found'], 404);
            }

            $project = $projectStage->project;

            if ($file) {
                // Если файл передан, выполняем загрузку
                $fileRecord = $this->fileUploadService->uploadFile(
                    $file,
                    '/' . $project->path_project_folder . '/Счета на оплату (подтверждённые)/',
                    'localERPFiles'
                );

                $orderNumber = $this->generateOrderNumber($project, $projectStage);

                $this->fileUploadService->createProjectFile($project->id, $fileRecord->id, 'STAGE_PAYMENT', $datePayment, $orderNumber);

                DB::update(
                    'UPDATE project_stages
                 SET payment_file_id = ?, payment_date = ?, updated_at = NOW()
                 WHERE project_id = ? AND stage_id = ?',
                    [$fileRecord->id, $datePayment, $projectId, $projectStage->stage_id]
                );

                return response()->json(['success' => true, 'file' => $fileRecord->id]);
            } else {
                // Если файл не передан, обновляем только дату
                DB::update(
                    'UPDATE project_stages
                 SET payment_date = ?, updated_at = NOW()
                 WHERE project_id = ? AND stage_id = ?',
                    [$datePayment, $projectId, $projectStage->stage_id]
                );

                return response()->json(['success' => true, 'message' => 'Payment date updated without file.']);
            }
        }
    }


    private function findProjectStage($projectId, $stageNumber)
    {
        $projectStage = ProjectStageModel::where('project_id', $projectId)
            ->where('number', "=", $stageNumber)
            ->first();

        if (!$projectStage) {
            abort(404, "Project stage not found for stage number $stageNumber in project $projectId");
        }

        return $projectStage;
    }


    private function generateOrderNumber($project, $projectStage = null)
    {
        return 'Д' .
            str_pad($project->organization_customer->id, 4, '0', STR_PAD_LEFT) . '-' .
            str_pad($projectStage->id ?? $project->id, 4, '0', STR_PAD_LEFT) .
            rand(100, 999);
    }

}
