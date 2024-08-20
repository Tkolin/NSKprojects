<?php


use App\Http\Controllers\ExecutorContractController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::get('/he', function () {
    return view('welcome');
});

Route::get('/download-contract/{filename}', [ExecutorContractController::class, 'downloadExecutorContract']);
Route::get('/download-taskExecutorContract/{filename}', [ExecutorContractController::class, 'TaskExecutorContract']);

Route::get('/download-project/{filename}', [ProjectController::class, 'downloadProject']);
Route::get('/download-projectIrds/{filename}', [ProjectController::class, 'downloadIrdsProject']);
Route::get('/download-projectStages/{filename}', [ProjectController::class, 'downloadStageProject']);

Route::get('/download-projectActRender/{filename}', [ProjectController::class, 'downloadActRenderingServicesProject']);
Route::get('/download-projectPaymentInvoice/{filename}', [ProjectController::class, 'downloadPaymentInvoiceProject']);

Route::get('/temporary/{filename}', [FileController::class, 'downloadFile']);
Route::post('/upload', [FileUploadController::class, 'upload']);
Route::post('/project/upload/executor_order/{orderId}', [FileUploadController::class, 'uploadExecutorOrder']);
Route::post('/project/upload/executor_order_payment/page', [FileUploadController::class, 'uploadOrderPayment']);
Route::post('/project/upload/project_contract/page', [FileUploadController::class, 'uploadProjectContract']);
Route::post('/project/upload/project_kp/page', [FileUploadController::class, 'uploadProjectKp']);
Route::get('/csrf-token', function () {
    return response()->json(['csrfToken' => csrf_token()]);
});
