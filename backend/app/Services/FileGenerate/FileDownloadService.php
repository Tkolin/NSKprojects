<?php

namespace App\Services\FileGenerate;

use App\Models\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileDownloadService
{
    public static function getUrlDownloadFile($fileId): string
    {
        $file = File::find($fileId);

        if (!$file) {
            throw new \Exception('File not found.');
        }

        $filePath = $file->path;

        // Проверка наличия файла
        if (!Storage::disk('localERPFiles')->exists($filePath)) {
            throw new \Exception('File does not exist in the specified location.');
        }

        // Копирование файла в public/storage
        $temporaryFilePath = 'temporary/' . Str::random(10) . '_' . $file->name;
        Storage::disk('public')->put($temporaryFilePath, Storage::disk('localERPFiles')->get($filePath));

        // Генерация ссылки для скачивания
        $url = Storage::disk('public')->url($temporaryFilePath);

        return $url;
    }
}
