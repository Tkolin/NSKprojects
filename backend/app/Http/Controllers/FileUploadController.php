<?php

namespace App\Http\Controllers;

use App\Models\ExecutorOrder;
use App\Models\ExecutorOrderPayment;
use App\Models\File;
use App\Models\Project;
use App\Models\ProjectFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadController extends Controller
{
    public function upload(Request $request, $projectNumber)
    {
        error_log("projectNumber" . $projectNumber);
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('uploads');

            $fileRecord = File::create([
                'name' => $file->getClientOriginalName(),
                'path' => $path,
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

            $pathProjectFolder = $project->path_project_folder;
            $storagePath = "/" . $pathProjectFolder . "/Договора_с_заказчиком/" . $file->getClientOriginalName();
            error_log('$project' . $project);

            Storage::disk('localERPFiles')->put($storagePath, $file->getClientOriginalName());

            $fileRecord = File::create([
                'name' => $file->getClientOriginalName(),
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

            $pathProjectFolder = $project->path_project_folder;
            $storagePath = "/" . $pathProjectFolder . "/Коммерческое_предложение/" . $file->getClientOriginalName();
            error_log('$project' . $project);

            Storage::disk('localERPFiles')->put($storagePath, file_get_contents($file->getRealPath()));

            $fileRecord = File::create([
                'name' => $file->getClientOriginalName(),
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

    public function uploadExecutorOrder(Request $request, $orderId)
    {

        error_log("orderId " . $orderId);
        if ($request->hasFile('file')) {
            $file = $request->file('file');

            $order = ExecutorOrder::with('project_tasks.project')->find($orderId);
            $pathProjectFolder = $order->project_tasks[0]->project->path_project_folder;
            $storagePath = "/" . $pathProjectFolder . "/Договора_с_исполнителями/" . $file->getClientOriginalName();

            error_log('$storagePath' . $storagePath);
            Storage::disk('localERPFiles')->put($storagePath, $file->getClientOriginalName());

            $fileRecord = File::create([
                'name' => $file->getClientOriginalName(),
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
            $pathProjectFolder = $order->project_tasks[0]->project->path_project_folder;
            $storagePath = "/" . $pathProjectFolder . "/Договора_с_исполнителями/Оплаты/" . $file->getClientOriginalName();

            error_log('$storagePath' . $storagePath);
            Storage::disk('localERPFiles')->put($storagePath, $file->getClientOriginalName());

            $fileRecord = File::create([
                'name' => $file->getClientOriginalName(),
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
