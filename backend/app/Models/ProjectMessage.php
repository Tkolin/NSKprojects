<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectMessage extends Model
{
    protected $fillable = [
        'number_message',
        'title',
        'sender',
        'project_id',
        'file_name',
        'date_send',
    ];

}
