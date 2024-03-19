<?php

use App\Http\Controllers\ContractController;
use App\Http\Controllers\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Nuwave\Lighthouse\GraphQL;

Route::get('/download-contract/{filename}', [ContractController::class, 'download']);
<<<<<<< HEAD
Route::get('/download-project/{filename}', [ProjectController::class, 'downloadProject']);
Route::get('/download-projectIrds/{filename}', [ProjectController::class, 'downloadIrdsProject']);
Route::get('/download-projectStages/{filename}', [ProjectController::class, 'downloadStageProject']);
=======
Route::get('/download-project/{filename}', [ProjectController::class, 'download']);
>>>>>>> origin/master

