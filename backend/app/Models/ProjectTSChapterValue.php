<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectTSChapterValue extends Model
{

    protected $table = 'project_ts_chapter_values';

    protected $fillable = [
        'id',
        'project_ts_chapter_id',
        'project_value_id',
        'content_key'
    ];
}
