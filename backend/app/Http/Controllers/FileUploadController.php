<?php

namespace App\Http\Controllers;

use App\Models\ExecutorOrder;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\File;

class FileUploadController extends Controller
{
    public function upload(Request $request,$projectNumber)
    {
        error_log("projectNumber".$projectNumber);
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
        error_log("projectId ".$projectId);
        if ($request->hasFile('file')) {
            $file = $request->file('file');

            $project = Project::find($projectId);

            $pathProjectFolder = $project->path_project_folder;
            $storagePath = "/" . $pathProjectFolder . "/Договора_с_заказчиком/" . $file->getClientOriginalName();
            error_log('$project' .  $project);

            Storage::disk('localERPFiles')->put($storagePath, $file->getClientOriginalName());

            $fileRecord = File::create([
                'name' => $file->getClientOriginalName(),
                'path' => $storagePath,
                'size' => $file->getSize(),
                'mime_type' => $file->getClientMimeType(),
            ]);
            $project->update(['contract_file_id'=>$fileRecord->id, 'date_signing'=>$dateSinging]);
            return response()->json([
                'success' => true,
                'file' => $fileRecord,
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
    }
    public function uploadExecutorOrder(Request $request,$orderId)
    {

        error_log("orderId ".$orderId);
        if ($request->hasFile('file')) {
            $file = $request->file('file');

            $order = ExecutorOrder::with('project_tasks.project')->find($orderId);
            $pathProjectFolder = $order->project_tasks[0]->project->path_project_folder;
            $storagePath = "/" . $pathProjectFolder . "/Договора_с_исполнителями/" . $file->getClientOriginalName();

            error_log('$storagePath' .  $storagePath);
            Storage::disk('localERPFiles')->put($storagePath, $file->getClientOriginalName());

            $fileRecord = File::create([
                'name' => $file->getClientOriginalName(),
                'path' => $storagePath,
                'size' => $file->getSize(),
                'mime_type' => $file->getClientMimeType(),
            ]);
            $order->update(['signed_file_id'=>$fileRecord->id]);
            return response()->json([
                'success' => true,
                'file' => $fileRecord,
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
    }
}
