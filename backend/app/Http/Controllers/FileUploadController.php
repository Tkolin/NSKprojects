<?php declare(strict_types=1);


namespace App\Http\Controllers;

use App\Models\ExecutorOrder;
use App\Models\ExecutorOrderPayment;
use App\Models\File;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\ProjectStage;
use App\Services\FileGenerate\FormatterService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadController extends Controller
{
    private function generateUniqueFilePath($directory, $originalFileName)
    {
        $storagePath = $directory . $originalFileName;
        $uniqueSuffix = "_" . time();
        $storagePath = $directory . pathinfo($originalFileName, PATHINFO_FILENAME) . $uniqueSuffix . "." . pathinfo($originalFileName, PATHINFO_EXTENSION);
        return $storagePath;
    }

    public function upload(Request $request, $projectNumber)
    {
        error_log("projectNumber" . $projectNumber);
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $directory = 'uploads/';
            $storagePath = $this->generateUniqueFilePath($directory, $file->getClientOriginalName());

            Storage::disk('local')->put($storagePath, file_get_contents($file->getRealPath()));

            $fileRecord = File::create([
                'name' => pathinfo($storagePath, PATHINFO_BASENAME),
                'path' => $storagePath,
                'size' => $file->getSize(),
                'mime_type' => $file->getClientMimeType(),
            ]);

            return response()->json([
                'success' => true,
                'file' => $fileRecord,
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
    }

    public function uploadProjectContract(Request $request)
    {
        $projectId = $request->query('projectId');
        $dateSinging = $request->query('date');
        error_log("projectId " . $projectId);
        if ($request->hasFile('file')) {
            $file = $request->file('file');

            $project = Project::find($projectId);
            $directory = "/" . $project->path_project_folder . "/Договора с заказчиком/";
            $storagePath = $this->generateUniqueFilePath($directory, $file->getClientOriginalName());

            Storage::disk('localERPFiles')->put($storagePath, file_get_contents($file->getRealPath()));

            $fileRecord = File::create([
                'name' => pathinfo($storagePath, PATHINFO_BASENAME),
                'path' => $storagePath,
                'size' => $file->getSize(),
                'mime_type' => $file->getClientMimeType(),
            ]);

            ProjectFile::create([
                'project_id' => $projectId,
                'file_id' => $fileRecord->id,
                'type' => "CONTRACT_STAMP",
                'number' => -1,
                'date_document' => $dateSinging,
            ]);
            $project->update(['contract_file_id' => $fileRecord->id, 'date_signing' => $dateSinging]);

            return response()->json([
                'success' => true,
                'file' => $fileRecord,
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
    }

    public function uploadProjectKp(Request $request)
    {
        $projectId = $request->query('projectId');
        $dateSinging = $request->query('date');
        error_log("projectId " . $projectId);
        if ($request->hasFile('file')) {
            $file = $request->file('file');

            $project = Project::find($projectId);
            $directory = "/" . $project->path_project_folder . "/Коммерческие предложения/";
            $storagePath = $this->generateUniqueFilePath($directory, $file->getClientOriginalName());

            Storage::disk('localERPFiles')->put($storagePath, file_get_contents($file->getRealPath()));

            $fileRecord = File::create([
                'name' => pathinfo($storagePath, PATHINFO_BASENAME),
                'path' => $storagePath,
                'size' => $file->getSize(),
                'mime_type' => $file->getClientMimeType(),
            ]);

            ProjectFile::create([
                'project_id' => $projectId,
                'file_id' => $fileRecord->id,
                'type' => "KP",
                'number' => -1,
                'date_document' => $dateSinging,
            ]);

            $project->update(['kp_file_id' => $fileRecord->id]);

            return response()->json([
                'success' => true,
                'file' => $fileRecord,
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
    }
    public function uploadWorkActSinging(Request $request)
    {
        $projectId = $request->query('projectId');
        $stageNumber = $request->query('stageNumber');
        $datePayment = $request->query('date');
        if ($request->hasFile('file')) {
            $file = $request->file('file');

            $projectStage = ProjectStage::where("project_id", "=", $projectId)
                ->where("number", "=", $stageNumber)->first();

            // Проверка на существование этапа проекта
            if (!isset($projectStage)) {
                return response()->json(['success' => false, 'message' => 'Project stage not found numb' . $stageNumber . ' in project ' . $projectId], 404);
            }

            $project = $projectStage->project;
            $directory = "/" . $project->path_project_folder . "/Счета на оплату (подтверждённые)/";
            $storagePath = $this->generateUniqueFilePath($directory, $file->getClientOriginalName());

            Storage::disk('localERPFiles')->put($storagePath, file_get_contents($file->getRealPath()));

            $fileRecord = File::create([
                'name' => pathinfo($storagePath, PATHINFO_BASENAME),
                'path' => $storagePath,
                'size' => $file->getSize(),
                'mime_type' => $file->getClientMimeType(),
            ]);
            $orderNumber = "А" . FormatterService::formatWithLeadingZeros($project["organization_customer"]['id'], 4) . "-" .
            FormatterService::formatWithLeadingZeros($projectStage['id'] ?? $project['id'], 4)
            . rand(100, 999);
            ProjectFile::create([
                'project_id' => $project->id,
                'file_id' => $fileRecord->id,
                'type' => "STAGE_WORK_ACT",
                'number' => 1,
                'date_document' => $datePayment,
                'document_number' => $orderNumber,

            ]);

 
            ProjectStage::where("project_id", "=", $projectId)->where("number", "=", $stageNumber)
                ->update([
                    'work_act_file_id' => $fileRecord->id,
                    'work_act_singing_date' => $datePayment,
                ]);
            return response()->json([
                'success' => true,
                'file' => $fileRecord,
            ]);
        }
        return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
    }

    public function uploadPaymentInvoice(Request $request)
    {
        $projectId = $request->query('projectId');
        $stageNumber = $request->query('stageNumber');
        $datePayment = $request->query('date');
        if ($request->hasFile('file')) {

            $file = $request->file('file');
            if ($stageNumber === '0') {

                $project = Project::find($projectId);
                $directory = "/" . $project->path_project_folder . "/Счета на оплату (подтверждённые)/";
                $storagePath = $this->generateUniqueFilePath($directory, $file->getClientOriginalName());

                Storage::disk('localERPFiles')->put($storagePath, file_get_contents($file->getRealPath()));

                $fileRecord = File::create([
                    'name' => pathinfo($storagePath, PATHINFO_BASENAME),
                    'path' => $storagePath,
                    'size' => $file->getSize(),
                    'mime_type' => $file->getClientMimeType(),
                ]);
                $orderNumber = "Д" . FormatterService::formatWithLeadingZeros($project["organization_customer"]['id'], 4) . "-" .
                FormatterService::formatWithLeadingZeros($projectStage['id'] ?? $project['id'], 4) . rand(100, 999);
    
                $projectFileRecord = ProjectFile::create([
                    'project_id' => $project->id,
                    'file_id' => $fileRecord->id,
                    'type' => "STAGE_PAYMENT",
                    'number' => 1,
                    'date_document' => $datePayment,
                    'document_number' =>  $orderNumber,
                ]);

                $project->prepayment_date = $datePayment;
                $project->prepayment_file_id = $projectFileRecord->file_id;
                $project->save();
                return response()->json([
                    'success' => true,
                    'file' => $fileRecord,
                ]);
            } else {
                $projectStage = ProjectStage::where("project_id", "=", $projectId)
                    ->where("number", "=", $stageNumber)->first();

                // Проверка на существование этапа проекта
                if (!isset($projectStage)) {
                    return response()->json(['success' => false, 'message' => 'Project stage not found numb' . $stageNumber . ' in project ' . $projectId], 404);
                }

                $project = $projectStage->project;
                $directory = "/" . $project->path_project_folder . "/Счета на оплату (подтверждённые)/";
                $storagePath = $this->generateUniqueFilePath($directory, $file->getClientOriginalName());

                Storage::disk('localERPFiles')->put($storagePath, file_get_contents($file->getRealPath()));

                $fileRecord = File::create([
                    'name' => pathinfo($storagePath, PATHINFO_BASENAME),
                    'path' => $storagePath,
                    'size' => $file->getSize(),
                    'mime_type' => $file->getClientMimeType(),
                ]);
                $orderNumber = "Д" . FormatterService::formatWithLeadingZeros($project["organization_customer"]['id'], 4) . "-" .
                FormatterService::formatWithLeadingZeros($projectStage['id'] ?? $project['id'], 4) . rand(100, 999);
    
                ProjectFile::create([
                    'project_id' => $project->id,
                    'file_id' => $fileRecord->id,
                    'type' => "STAGE_PAYMENT",
                    'number' => 1,
                    'date_document' => $datePayment,
                    'document_number' =>  $orderNumber,
                ]);


                ProjectStage::where("project_id", "=", $projectId)->where("number", "=", $stageNumber)
                    ->update([
                        'payment_file_id' => $fileRecord->id,
                        'payment_date' => $datePayment,
                    ]);
                return response()->json([
                    'success' => true,
                    'file' => $fileRecord,
                ]);

            }

        }

        return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
    }

    public function uploadExecutorOrder(Request $request, $orderId)
    {
        error_log("orderId " . $orderId);
        if ($request->hasFile('file')) {
            $file = $request->file('file');

            $order = ExecutorOrder::with('project_tasks.project')->find($orderId);
            $directory = "/" . $order->project_tasks[0]->project->path_project_folder . "/Договора с исполнителями/";
            $storagePath = $this->generateUniqueFilePath($directory, $file->getClientOriginalName());

            Storage::disk('localERPFiles')->put($storagePath, file_get_contents($file->getRealPath()));

            $fileRecord = File::create([
                'name' => pathinfo($storagePath, PATHINFO_BASENAME),
                'path' => $storagePath,
                'size' => $file->getSize(),
                'mime_type' => $file->getClientMimeType(),
            ]);

            $order->update(['signed_file_id' => $fileRecord->id]);

            return response()->json([
                'success' => true,
                'file' => $fileRecord,
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
    }

    public function uploadOrderPayment(Request $request)
    {
        $executorOrderId = $request->query('executorOrderId');
        $status = $request->query('status');
        $date = $request->query('date');
        error_log("executorOrderId " . $executorOrderId);
        error_log("status " . $status);
        error_log("date " . $date);

        if ($request->hasFile('file')) {
            $file = $request->file('file');

            $order = ExecutorOrder::with('project_tasks.project')->find($executorOrderId);
            $directory = "/" . $order->project_tasks[0]->project->path_project_folder . "/Договора с исполнителями/Оплаты/";
            $storagePath = $this->generateUniqueFilePath($directory, $file->getClientOriginalName());

            Storage::disk('localERPFiles')->put($storagePath, file_get_contents($file->getRealPath()));

            $fileRecord = File::create([
                'name' => pathinfo($storagePath, PATHINFO_BASENAME),
                'path' => $storagePath,
                'size' => $file->getSize(),
                'mime_type' => $file->getClientMimeType(),
            ]);

            ExecutorOrderPayment::create([
                'file_id' => $fileRecord->id,
                'executor_order_id' => $order->id,
                'status' => 'COMPLETED',
                'type_payment' => $status . "",
            ]);

            return response()->json([
                'success' => true,
                'file' => $fileRecord,
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
    }
}

