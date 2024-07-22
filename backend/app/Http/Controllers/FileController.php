<?php

namespace App\Http\Controllers;

class FileController extends Controller
{
    public function downloadFile($filename)
    {
        $filePath = storage_path('app/public/temporary/' . $filename);
        if (!file_exists($filePath)) {
            abort(404);
        }
        // Удаление первых 40 знаков из имени файла
             $filename = substr($filename, 42);

        return response()->download($filePath, $filename)->deleteFileAfterSend(true);
    }

}
