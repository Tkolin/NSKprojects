<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectFile extends Model
{
    protected $fillable = [
        'project_id',
        'file_id',
        'type',
        'number',
        'date_document',
        'document_number'
    ];
    /**
     * Получить количество файлов с типом 'KP'.
     *
     * @return int
     */
    public static function getCountKP(): int
    {
        return self::where('type', 'KP')->count();
    }

}
