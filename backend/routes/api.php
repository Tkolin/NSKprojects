<?php


use App\Http\Controllers\ExecutorContractController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FileUpload\ProjectExecutor;
use App\Http\Controllers\FileUpload\ProjectMain;
use App\Http\Controllers\FileUpload\ProjectStage;
// use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\OrganizationFastCreatorController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::get('/download-contract/{filename}', [ExecutorContractController::class, 'downloadExecutorContract']);
Route::get('/download-taskExecutorContract/{filename}', [ExecutorContractController::class, 'TaskExecutorContract']);

Route::get('/download-project/{filename}', [ProjectController::class, 'downloadProject']);
Route::get('/download-projectIrds/{filename}', [ProjectController::class, 'downloadIrdsProject']);
Route::get('/download-projectStages/{filename}', [ProjectController::class, 'downloadStageProject']);

Route::get('/download-projectActRender/{filename}', [ProjectController::class, 'downloadActRenderingServicesProject']);
Route::get('/download-projectPaymentInvoice/{filename}', [ProjectController::class, 'downloadPaymentInvoiceProject']);

Route::get('/temporary/{filename}', [FileController::class, 'downloadFile']);

Route::get('/create_organization_by_inn/{inn}', [OrganizationFastCreatorController::class, 'createByInn']);

// Загрузка файлов по проекту
Route::post('/upload', [ProjectMain::class, 'upload']);
Route::post('/project/upload/project_contract/page', [ProjectMain::class, 'uploadProjectContract']);
Route::post('/project/upload/project_kp/page', [ProjectMain::class, 'uploadProjectKp']);
// Загрузка файлов по этапам
Route::post('/project/upload/work_act_singing/page', [ProjectStage::class, 'uploadWorkActSinging']);
Route::post('/project/upload/payment_invoice/page', [ProjectStage::class, 'uploadPaymentInvoice']);
// Загрузка файлов по исполнителям
Route::post('/project/upload/executor_order/page', [ProjectExecutor::class, 'uploadExecutorOrder']);
Route::post('/project/upload/executor_order_payment/page', [ProjectExecutor::class, 'uploadOrderPayment']);
Route::post('/project/upload/executor_order_payment_paycheck/page', [ProjectExecutor::class, 'uploadOrderPaymentPaycheck']);

Route::get('/csrf-token', function () {
    return response()->json(['csrfToken' => csrf_token()]);
});
