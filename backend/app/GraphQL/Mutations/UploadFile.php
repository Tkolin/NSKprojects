<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\File;
use Illuminate\Support\Str;

final readonly class UploadFile
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $file = $args['file'];

        // Сохраняем файл
        $path = $file->store('uploads');

        // Сохраняем информацию о файле в базе данных
        $fileRecord = File::create([
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'size' => $file->getSize(),
            'source' => 'UPLOAD',
            'mime_type' => $file->getClientMimeType(),
        ]);

        return $fileRecord;
    }
}
