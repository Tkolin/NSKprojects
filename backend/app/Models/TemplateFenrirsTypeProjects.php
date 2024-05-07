<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateFenrirsTypeProjects extends Model
{
    protected $fillable = [
        'template_fenrirs_id',
        'type_project_id',
    ];
    public function template_fenrirs(): BelongsTo
    {
        return $this->belongsTo(TemplateFenrirs::class);
    }
}
