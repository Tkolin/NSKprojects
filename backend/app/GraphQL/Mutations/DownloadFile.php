<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final readonly class DownloadFile
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $fileId = $args['id'];
        $file = File::find($fileId);

        if (!$file) {
            throw new \Exception('File not found.');
        }

        $filePath = $file->path;

        // Проверка наличия файла
        if (!Storage::disk('localERPFiles')->exists($filePath)) {
            throw new \Exception('File does not exist in the specified location.');
        }

        // Формирование имени файла
        $filename = pathinfo($file->name, PATHINFO_FILENAME);
        error_log("filename " . $filename);
        $extension = pathinfo($file->name, PATHINFO_EXTENSION);

        // Сокращение имени файла, если оно длиннее 40 символов
        if (mb_strlen($filename) > 40 && $file->source === "GENERATED") {
            $filename = mb_substr($filename, 31); // Убираем первые 31 символ
        }
        error_log(message: "new filename " . $filename);

        // Добавление временной метки
        $timestamp = now()->format('YmdHis');
        $temporaryFilePath = 'temporary/' . $filename . '.' . $extension;
        error_log(message: "new temporaryFilePath " . $temporaryFilePath);

        // Копирование файла во временную директорию
        Storage::disk('public')->put($temporaryFilePath, Storage::disk('localERPFiles')->get($filePath));

        // Генерация ссылки для скачивания
        $url = Storage::disk('public')->url($temporaryFilePath);

        return ['url' => $temporaryFilePath];
    }
}
