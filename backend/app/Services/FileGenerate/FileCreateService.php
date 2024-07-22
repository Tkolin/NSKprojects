<?php

namespace App\Services\FileGenerate;

use App\Models\File;
use App\Models\Organization;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\TemplateProcessor;
use App\Services\FileGenerate\GeneratorService;

class FileCreateService
{
    public static function saveFileToProject($storagePath, $filePath, $fileName): File
    {
        $fileContents = file_get_contents($filePath);
        Storage::disk('localERPFiles')->put($storagePath, $fileContents);
        $fileSize = filesize($filePath);
        $mimeType = mime_content_type($filePath);
        $file = File::create([
            'name' => $fileName,
            'path' => $storagePath,
            'size' => $fileSize,
            'mime_type' => $mimeType,
        ]);
        return $file;
    }
}
