<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Permission extends Model
{

    protected $fillable = [
        'name',
        'name_key',
        'description',
        'created_at',
        'updated_at',
        'group_key'
    ];

    protected $primaryKey = 'name_key';
    public $incrementing = false;
    protected $keyType = 'string';
    /**
     * The roles that belong to the permission.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'permission_roles', 'permission_id', 'role_id');
    }
    public function group(): BelongsTo
    {
        return $this->belongsTo(PermissionGroup::class, 'group_key', 'name_key');
    }
}
