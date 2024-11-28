<?php

namespace App\Http\Controllers\FileUpload;

use App\Http\Controllers\Controller;
use App\Models\ExecutorOrder;
use App\Models\ExecutorOrderPayment;
use App\Models\File;
use App\Models\ProjectFile;
use App\Services\FileUpload\FileUploadService;
use Illuminate\Http\Request;

class ProjectExecutor extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function uploadOrderPaymentPaycheck(Request $request)
    {
        $executorOrderPaymentId = $request->query('executorOrderPaymentId');
        $file = $this->fileUploadService->validateAndGetFile($request);

        $executorOrderPayment = ExecutorOrderPayment::findOrFail($executorOrderPaymentId);
        $project = $executorOrderPayment->getProject(); // BelongsTo вернёт единственный проект.

        if (!$project) {
            return response()->json(['error' => 'Project not found for this payment' . $executorOrderPayment], 404);
        }

        $fileRecord = $this->fileUploadService->uploadFile(
            $file,
            '/' . $project->path_project_folder . '/Договора с заказчиком/Чеки/',
            'localERPFiles'
        );

        $this->fileUploadService->createProjectFile($project->id, $fileRecord->id, 'EXECUTOR_ORDER_PAYMENT_UP');
        $executorOrderPayment->update(['paycheck_file_id' => $fileRecord->id]);

        return response()->json(['success' => true, 'file' => $fileRecord->id]);
    }


    public function uploadExecutorOrder(Request $request)
    {
        $orderId = $request->query('executor_order_id');
        $file = $this->fileUploadService->validateAndGetFile($request);

        $order = ExecutorOrder::with('project_tasks.project')->findOrFail($orderId);
        $project = $order->project_tasks[0]->project;

        $fileRecord = $this->fileUploadService->uploadFile(
            $file,
            '/' . $project->path_project_folder . '/Договора с исполнителями/',
            'localERPFiles'
        );

        $this->fileUploadService->createProjectFile($project->id, $fileRecord->id, 'EXECUTOR_ORDER', null, $order->number);
        $order->update(['signed_file_id' => $fileRecord->id]);

        return response()->json(['success' => true, 'file' => $fileRecord->id]);
    }

    public function uploadOrderPayment(Request $request)
    {
        $executorOrderId = $request->query('executorOrderId');
        $status = $request->query('status');
        $date = $request->query('date');
        $file = $this->fileUploadService->validateAndGetFile(request: $request);

        $order = ExecutorOrder::with('project_tasks.project')->findOrFail($executorOrderId);
        $project = $order->project_tasks[0]->project;

        $fileRecord = $this->fileUploadService->uploadFile(
            $file,
            '/' . $project->path_project_folder . '/Договора с исполнителями/Оплаты/',
            'localERPFiles'
        );

        $this->fileUploadService->createProjectFile($project->id, $fileRecord->id, 'EXECUTOR_ORDER_PAYMENT_UP', $date);
        ExecutorOrderPayment::updateOrCreate(
            [
                'executor_order_id' => $order->id,
                'type_payment' => $status,
            ]
            ,
            [
                'file_id' => $fileRecord->id,
                'executor_order_id' => $order->id,
                'type_payment' => $status,
                'status' => 'COMPLETED',
            ]
        );

        return response()->json(['success' => true, 'file' => $fileRecord->id]);
    }
}
