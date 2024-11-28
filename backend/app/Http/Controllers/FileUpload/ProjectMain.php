<?php

namespace App\Http\Controllers\FileUpload;

use App\Http\Controllers\Controller;
use App\Models\File;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Services\FileUpload\FileUploadService;
use Illuminate\Http\Request;

class ProjectMain extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function uploadProjectKp(Request $request)
    {
        $projectId = $request->query('projectId');
        $dateSigning = $request->query('date');
        $file = $this->fileUploadService->validateAndGetFile($request);

        $project = Project::findOrFail($projectId);

        $fileRecord = $this->fileUploadService->uploadFile(
            $file,
            '/' . $project->path_project_folder . '/Коммерческие предложения/',
            'localERPFiles'
        );

        $this->fileUploadService->createProjectFile($projectId, $fileRecord->id, 'KP', $dateSigning);

        $project->update(['kp_file_id' => $fileRecord->id]);

        return response()->json(['success' => true, 'file' => $fileRecord->id]);
    }

    public function upload(Request $request, $projectNumber)
    {
        $file = $this->fileUploadService->validateAndGetFile($request);

        $fileRecord = $this->fileUploadService->uploadFile($file, 'uploads/');

        return response()->json(['success' => true, 'file' => $fileRecord->id]);
    }

    public function uploadProjectContract(Request $request)
    {
        $projectId = $request->query('projectId');
        $dateSigning = $request->query('date');
        $file = $this->fileUploadService->validateAndGetFile($request);

        $project = Project::findOrFail($projectId);

        $fileRecord = $this->fileUploadService->uploadFile(
            $file,
            '/' . $project->path_project_folder . '/Договора с заказчиком/',
            'localERPFiles'
        );

        $this->fileUploadService->createProjectFile($projectId, $fileRecord->id, 'CONTRACT_STAMP', $dateSigning);

        $project->update(['contract_file_id' => $fileRecord->id, 'date_signing' => $dateSigning]);

        return response()->json(['success' => true, 'file' => $fileRecord->id]);
    }





}
