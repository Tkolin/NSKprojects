<?php

use App\Http\Controllers\ExecutorContractController;
use App\Http\Controllers\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Nuwave\Lighthouse\GraphQL;


Route::get('/download-contract/{filename}', [ExecutorContractController::class, 'downloadExecutorContract']);
Route::get('/download-taskExecutorContract/{filename}', [ExecutorContractController::class, 'TaskExecutorContract']);

Route::get('/download-project/{filename}', [ProjectController::class, 'downloadProject']);
Route::get('/download-projectIrds/{filename}', [ProjectController::class, 'downloadIrdsProject']);
Route::get('/download-projectStages/{filename}', [ProjectController::class, 'downloadStageProject']);


Route::get('/download-projectActRender/{filename}', [ProjectController::class, 'downloadActRenderingServicesProject']);
Route::get('/download-projectPaymentInvoice/{filename}', [ProjectController::class, 'downloadPaymentInvoiceProject']);


