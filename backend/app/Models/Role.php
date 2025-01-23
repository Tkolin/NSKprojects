<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Role extends Model
{
    protected $primaryKey = 'name_key';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'name_key',
        'description',
    ];
    /**
     * The users that belong to the role.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'role_user', 'user_id', 'user_id');
    }

    /**
     * The permissions that belong to the role.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(
            Permission::class,
            'permission_role',  // pivot-таблица
            'role_id',         // внешний ключ на Role
            'permission_id'    // внешний ключ на Permission
        );
    }

    public function permission_groups(): BelongsToMany
    {
        return $this->belongsToMany(
            PermissionGroup::class, // Связанная модель
            'permissions',          // Промежуточная таблица
            'group_key',            // Локальный ключ в промежуточной таблице
            'name_key',             // Связанный ключ в конечной таблице (PermissionGroups)
            'name_key',             // Локальный ключ в модели Role
            'name_key'              // Ключ в модели PermissionGroup
        )->distinct(); // Убираем дубли в случае пересекающихся прав.
    }
}
