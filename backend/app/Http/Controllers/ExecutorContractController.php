<?php

namespace App\Http\Controllers;

use App\Models\Person;
use App\GraphQL\Service\ContractGeneratorService;
use Illuminate\Http\Request;

class ExecutorContractController extends Controller
{
    public function downloadExecutorContract($filename)
    {
        $filePath = storage_path('app/' . $filename);
        if (!file_exists($filePath)) {
            abort(404);
        }

        return response()->download($filePath, 'Договор_с_исполнителем.docx')->deleteFileAfterSend(true);
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
