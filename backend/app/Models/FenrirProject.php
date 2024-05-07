<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FenrirProject extends Model
{
    protected $fillable = [
        'fenrir_id',
        'project_id',
    ];
    public function fenrirs(): BelongsTo
    {
        return $this->belongsTo(Fenrir::class);
    }
}
