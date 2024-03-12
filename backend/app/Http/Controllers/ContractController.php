<?php

namespace App\Http\Controllers;

use App\Models\Person;
use App\GraphQL\Service\ContractGeneratorService;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    public function download($filename)
    {
        $filePath = storage_path('app/' . $filename);
        if (!file_exists($filePath)) {
            abort(404);
        }

        return response()->download($filePath, 'contract.docx')->deleteFileAfterSend(true);
    }
}
