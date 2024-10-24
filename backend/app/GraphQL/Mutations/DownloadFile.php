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

        // Копирование файла в public/storage
        $temporaryFilePath = 'temporary/' . Str::random(length: 2) . '_' . $file->name;
        Storage::disk('public')->put($temporaryFilePath, Storage::disk('localERPFiles')->get($filePath));

        // Генерация ссылки для скачивания

        return ['url' => $temporaryFilePath];
    }
}
