<?php

namespace App\Http\Controllers\FileUpload;

use App\Http\Controllers\Controller;
use App\Models\File;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\ProjectStage as ProjectStageModel;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

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

        $this->fileUploadService->createProjectFile($project->id, $fileRecord->id, 'STAGE_WORK_ACT', $datePayment, $orderNumber);

        $projectStage->update([
            'work_act_file_id' => $fileRecord->id,
            'work_act_singing_date' => $datePayment,
        ]);

        return response()->json(['success' => true, 'file' => $fileRecord->id]);
    }

    public function uploadPaymentInvoice(Request $request)
    {
        $projectId = $request->query('projectId');
        $stageNumber = $request->query('stageNumber');
        $datePayment = $request->query('date');
        $file = $this->fileUploadService->validateAndGetFile($request);

        if ($stageNumber === '0') {
            $project = Project::findOrFail($projectId);

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
        }

        $projectStage = $this->findProjectStage($projectId, $stageNumber);

        $project = $projectStage->project;

        $fileRecord = $this->fileUploadService->uploadFile(
            $file,
            '/' . $project->path_project_folder . '/Счета на оплату (подтверждённые)/',
            'localERPFiles'
        );

        $orderNumber = $this->generateOrderNumber($project, $projectStage);

        $this->fileUploadService->createProjectFile($project->id, $fileRecord->id, 'STAGE_PAYMENT', $datePayment, $orderNumber);

        $projectStage->update([
            'payment_file_id' => $fileRecord->id,
            'payment_date' => $datePayment,
        ]);

        return response()->json(['success' => true, 'file' => $fileRecord->id]);
    }


    private function findProjectStage($projectId, $stageNumber)
    {
        $projectStage = ProjectStageModel::where('project_id', $projectId)
            ->where('number', $stageNumber)
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
