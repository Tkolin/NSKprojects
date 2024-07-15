<?php

namespace App\Http\Controllers;

class ExecutorContractController extends Controller
{
    public function downloadExecutorContract($filename)
    {
        $filePath = storage_path('app/' . $filename);
        if (!file_exists($filePath)) {
            abort(404);
        }

        return response()->download($filePath, $filename)->deleteFileAfterSend(true);
    }
    public function TaskExecutorContract($filename)
    {
        $filePath = storage_path('app/' . $filename);
        if (!file_exists($filePath)) {
            abort(404);
        }

        return response()->download($filePath, 'contractToTasks.docx')->deleteFileAfterSend(true);
    }
}
