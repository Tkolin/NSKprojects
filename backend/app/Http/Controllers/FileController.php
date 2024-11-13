<?php declare(strict_types=1);

namespace App\Http\Controllers;
class FileController extends Controller
{
    public function downloadFile($filename)
    {
        $filePath = storage_path('app/public/temporary/' . $filename);
        if (!file_exists($filePath)) {
            abort(404);
        }

        // Удалить всё до первого символа '_' включительно
        // $position = strpos($filename, '_');
        // if ($position !== false) {
        //     $filename = substr($filename, $position + 1);
        // }

        return response()->download($filePath, $filename)->deleteFileAfterSend(true);
    }
}
