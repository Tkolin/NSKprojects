<?php

namespace App\Services\FileGenerate;

use App\Models\File;
use Exception;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\TemplateProcessor;

abstract class DocumentGeneratorService
{
    protected $templatePath;
    protected $templateProcessor;
    protected $formatterService;
    protected $fileName;
    protected $filePath;
    protected $replacements;

    public function __construct($templatePath)
    {
        $this->templatePath = $templatePath;
        $this->initializeTemplateProcessor();
        $this->formatterService = new FormatterService();
    }

    protected function initializeTemplateProcessor()
    {
        // Проверка существования шаблона
        if (!file_exists($this->templatePath)) {
            throw new Exception("Шаблон документа не найден по пути: {$this->templatePath}");
        }

        // Создание временного файла копии шаблона
        $tempFilePath = tempnam(sys_get_temp_dir(), 'doc');
        if (!copy($this->templatePath, $tempFilePath)) {
            throw new Exception("Не удалось создать временный файл по пути: {$tempFilePath}");
        }

        $this->templateProcessor = new TemplateProcessor($tempFilePath);
    }

    /**
     * Получить ключи с нулевыми значениями из массива.
     *
     * @param array $array
     * @return array
     */
    public static function getNullKeys(array $array): array
    {
        $nullKeys = [];
        foreach ($array as $key => $value) {
            if (is_null($value)) {
                $nullKeys[] = $key;
            }
        }
        return $nullKeys;
    }

    /**
     * Проверить обязательные поля в замене и выбросить исключение, если какие-либо отсутствуют.
     *
     * @return bool
     * @throws Exception
     */
    public function checkReplacements(): bool
    {
        $nullKeys = self::getNullKeys($this->replacements); // Использование self для вызова статического метода
        if (count($nullKeys) === 0) { // Исправлено условие
            return true;
        }

        $message = "Не заполнены обязательные поля: " . implode(", ", $nullKeys);
        throw new Exception($message);
    }

    public function saveFileToProject($storagePath, $filePath, $fileName)
    {
        $fileContents = file_get_contents($filePath);
        Storage::disk('localERPFiles')->put($storagePath, $fileContents);
        $fileSize = filesize($filePath);
        $mimeType = mime_content_type($filePath);
        $file = File::create([
            'name' => $fileName,
            'path' => $storagePath,
            'source' => 'GENERATED',
            'size' => $fileSize,
            'mime_type' => $mimeType,
        ]);
        error_log("result", $file->id);

        return $file;
    }

    public function saveFileToExecutorOrder($storagePath, $filePath, $fileName)
    {
        $fileContents = file_get_contents($filePath);
        Storage::disk('localERPFiles')->put($storagePath, $fileContents);
        $fileSize = filesize($filePath);
        $mimeType = mime_content_type($filePath);
        $file = File::create([
            'name' => $fileName,
            'path' => $storagePath,
            'source' => 'GENERATED',
            'size' => $fileSize,
            'mime_type' => $mimeType,
        ]);
        return $file;
    }

    public function replaceValues()
    {
        foreach ($this->replacements as $key => $value) {
            $this->templateProcessor->setValue($key, $value);
        }
    }

    public function saveDocument($fileName)
    {
        $this->fileName = Str::random(30) . "_" . $fileName;
        $this->filePath = storage_path('app/public/temporary/' . $this->fileName);
        $this->templateProcessor->saveAs($this->filePath);
    }

    protected function cleanUp()
    {
        if (!unlink($this->tempFilePath)) {
            error_log("Не удалось удалить временный файл по пути: {$this->tempFilePath}");
        }
    }

    abstract public function generate(array $data);
}
