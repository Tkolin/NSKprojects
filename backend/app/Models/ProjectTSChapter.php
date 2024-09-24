<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectTSChapter extends Model
{
    protected $table = 'project_ts_chapters';

    protected $fillable = [
        'id',
        'project_id',
        'ts_chapter_id'
    ];
}
