<?php

use App\Http\Controllers\ExecutorContractController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;


Route::get('/download-contract/{filename}', [ExecutorContractController::class, 'downloadExecutorContract']);
Route::get('/download-taskExecutorContract/{filename}', [ExecutorContractController::class, 'TaskExecutorContract']);

Route::get('/download-createNewProject/{filename}', [ProjectController::class, 'downloadProject']);
Route::get('/download-projectIrds/{filename}', [ProjectController::class, 'downloadIrdsProject']);
Route::get('/download-projectStages/{filename}', [ProjectController::class, 'downloadStageProject']);

Route::get('/temporary/{filename}', [FileController::class, 'downloadFile']);


Route::get('/download-projectActRender/{filename}', [ProjectController::class, 'downloadActRenderingServicesProject']);
Route::get('/download-projectPaymentInvoice/{filename}', [ProjectController::class, 'downloadPaymentInvoiceProject']);

Route::post('/project/upload/project_kp/page', [FileUploadController::class, 'uploadProjectKp']);
