<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectChapterTechnicalSpecification extends Model
{
    protected $table = 'project_chapters_technical_specification';

    protected $fillable = [
        'project_id',
        'chapters_id',
        'number',
    ];
}
