<?php

use App\GraphQL\Mutations\RegisterMutation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ContactController;
use App\Http\Controllers\PositionController;

Route::get('/positions', [PositionController::class, 'positions']);
