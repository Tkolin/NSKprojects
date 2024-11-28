<?php

namespace App\Services\FileUpload;

use App\Models\File;
use App\Models\ProjectFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    public function uploadFile($file, $directory, $disk = 'local')
    {
        $uniqueName = $this->generateUniqueFilePath($directory, $file->getClientOriginalName());
        Storage::disk($disk)->put($uniqueName, file_get_contents($file->getRealPath()));

        return File::create([
            'name' => pathinfo($uniqueName, PATHINFO_BASENAME),
            'path' => $uniqueName,
            'source' => 'UPLOAD',
            'size' => $file->getSize(),
            'mime_type' => $file->getClientMimeType(),
        ]);
    }

    private function generateUniqueFilePath($directory, $originalFileName)
    {
        $timestamp = time();
        $filename = pathinfo($originalFileName, PATHINFO_FILENAME);
        $extension = pathinfo($originalFileName, PATHINFO_EXTENSION);

        return $directory . $filename . '_' . $timestamp . '.' . $extension;
    }
    public function createProjectFile($projectId, $fileId, $type, $dateDocument = null, $documentNumber = null, $number = -1)
    {
        return ProjectFile::create([
            'project_id' => $projectId,
            'file_id' => $fileId,
            'type' => $type,
            'number' => $number,
            'date_document' => $dateDocument ?? now(),
            'document_number' => $documentNumber,
        ]);
    }

    public function validateAndGetFile(Request $request)
    {
        if (!$request->hasFile('file')) {
            abort(400, 'No file uploaded');
        }

        return $request->file('file');
    }
}
