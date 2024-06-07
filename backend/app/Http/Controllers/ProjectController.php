<?php

namespace App\Http\Controllers;

class ProjectController extends Controller
{
    public function downloadProject($filename)
    {
        $filePath = storage_path('app/' . $filename);
        if (!file_exists($filePath)) {
            abort(404);
        }

        return response()->download($filePath, $filename)->deleteFileAfterSend(true);
    }
    public function downloadIrdsProject($filename)
    {
        $filePath = storage_path('app/' . $filename);
        if (!file_exists($filePath)) {
            abort(404);
        }

        return response()->download($filePath, $filename)->deleteFileAfterSend(true);
    }
    public function downloadPaymentInvoiceProject($filename)
    {
        $filePath = storage_path('app/' . $filename);
        if (!file_exists($filePath)) {
            abort(404);
        }

        return response()->download($filePath, $filename)->deleteFileAfterSend(true);
    }
    public function downloadActRenderingServicesProject($filename)
    {
        $filePath = storage_path('app/' . $filename);
        if (!file_exists($filePath)) {
            abort(404);
        }

        return response()->download($filePath, $filename)->deleteFileAfterSend(true);
    }
    public function downloadStageProject($filename)
    {
        $filePath = storage_path('app/' . $filename);
        if (!file_exists($filePath)) {
            abort(404);
        }

        return response()->download($filePath, $filename)->deleteFileAfterSend(true);
    }
}
