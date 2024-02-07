<?php

use App\GraphQL\Mutations\RegisterMutation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', 'AuthController@login');
Route::post('/register', 'AuthController@register');

// Добавьте маршрут для разлогинивания
Route::middleware('auth:api')->post('/logout', 'AuthController@logout');
