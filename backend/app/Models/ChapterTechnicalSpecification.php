<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChapterTechnicalSpecification extends Model
{
    protected $table = 'chapters_technical_specification';

    protected $fillable = [
        'name',
        'template_text',
        'description',
    ];
}
