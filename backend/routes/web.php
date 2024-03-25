<?php


use App\Http\Controllers\ContractController;
use App\Http\Controllers\ProjectController;

use Illuminate\Support\Facades\Route;
use Nuwave\Lighthouse\GraphQL;

Route::get('/he', function () {
    return view('welcome');
});

Route::get('/download-contract/{filename}', [ContractController::class, 'download']);
Route::get('/download-project/{filename}', [ProjectController::class, 'downloadProject']);
Route::get('/download-projectIrds/{filename}', [ProjectController::class, 'downloadIrdsProject']);
Route::get('/download-projectStages/{filename}', [ProjectController::class, 'downloadStageProject']);

Route::get('/download-projectActRender/{filename}', [ProjectController::class, 'downloadIrdsProject']);
Route::get('/download-projectPaymentInvoice/{filename}', [ProjectController::class, 'downloadStageProject']);

