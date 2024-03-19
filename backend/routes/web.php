<?php

<<<<<<< HEAD
use App\Http\Controllers\ContractController;
use App\Http\Controllers\ProjectController;
=======
use App\Http\Controllers\FileController;
>>>>>>> origin/master
use Illuminate\Support\Facades\Route;
use Nuwave\Lighthouse\GraphQL;

Route::get('/he', function () {
    return view('welcome');
});
<<<<<<< HEAD

Route::get('/download-contract/{filename}', [ContractController::class, 'download']);
Route::get('/download-project/{filename}', [ProjectController::class, 'downloadProject']);
Route::get('/download-projectIrds/{filename}', [ProjectController::class, 'downloadIrdsProject']);
Route::get('/download-projectStages/{filename}', [ProjectController::class, 'downloadStageProject']);
=======
Route::get('/download-contract/{filename}', [FileController::class, 'download']);
>>>>>>> origin/master
