<?php

namespace App\Http\Controllers;

use App\Models\Person;
use App\GraphQL\Service\ContractGeneratorService;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function downloadProject($filename)
    {
        $filePath = storage_path('app/' . $filename);
        if (!file_exists($filePath)) {
            abort(404);
        }

        return response()->download($filePath, 'project.docx')->deleteFileAfterSend(true);
    }
    public function downloadIrdsProject($filename)
    {
        $filePath = storage_path('app/' . $filename);
        if (!file_exists($filePath)) {
            abort(404);
        }

        return response()->download($filePath, 'irdsProject.docx')->deleteFileAfterSend(true);
    }
    public function downloadStageProject($filename)
    {
        $filePath = storage_path('app/' . $filename);
        if (!file_exists($filePath)) {
            abort(404);
        }

        return response()->download($filePath, 'stageProject.docx')->deleteFileAfterSend(true);
    }
}
