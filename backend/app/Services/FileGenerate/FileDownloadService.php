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

        // Получение имени и расширения файла
        $filename = pathinfo($file->name, PATHINFO_FILENAME);
        $extension = pathinfo($file->name, PATHINFO_EXTENSION);

        // Сокращение имени файла, если оно больше 40 символов
        if (mb_strlen($filename) > 40) {
            $filename = mb_substr($filename, 31); // Убираем первые 31 символа
        }

        // Создание временного пути с меткой времени
        $timestamp = now()->format('YmdHis'); // Метка времени
        $temporaryFilePath = 'temporary/' . $filename . '_' . $timestamp . '.' . $extension;

        // Копирование файла во временную директорию
        Storage::disk('public')->put($temporaryFilePath, Storage::disk('localERPFiles')->get($filePath));

        // Генерация ссылки для скачивания
        $url = Storage::disk('public')->url($temporaryFilePath);

        return $url;
    }
}
