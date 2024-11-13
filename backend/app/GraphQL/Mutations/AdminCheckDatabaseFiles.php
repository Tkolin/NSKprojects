<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

final readonly class AdminCheckDatabaseFiles
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
         // Получаем все файлы из базы данных
         $files = DB::table('file')->select('id', 'path')->get();

         $missingFileIds = [];
 
         // Проверяем каждый файл
         foreach ($files as $file) {
             if (!Storage::disk('localERPFiles')->exists($file->path)) {
                 $missingFileIds[] = $file->id;
             }
         }
 
         return $missingFileIds;
    }
}
