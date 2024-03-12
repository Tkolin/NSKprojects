<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateFile extends Model
{
    protected $fillable = [
        "name",
        "file"
    ];

    public function type_file(): BelongsTo
    {
        return $this->belongsTo(TypeFile::class);
    }
}
