<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\Element\Image;
use PhpOffice\PhpWord\IOFactory;

final readonly class DownloadFile
{
    public function __invoke(null $_, array $args)
    {
        $fileId = $args['id'];
        $file = File::find($fileId);

        if (!$file) {
            throw new \Exception('File not found.');
        }

        $filePath = $file->path;
        // Проверка наличия файла
        if (!Storage::disk('localERPFiles')->exists($filePath)) {
            throw new \Exception('File does not exist in the specified location.');
        }

        // Копирование файла в public/storage
        $temporaryFilePath = 'temporary/' . Str::random(10) . '_' . $file->name;
        Storage::disk('public')->put($temporaryFilePath, Storage::disk('localERPFiles')->get($filePath));
        if (isset( $args['MODE'])) {
            $mode = $args['MODE'];
            switch ($mode) {
                case 'pdf':
                    // Конвертация в PDF
                    $pdfFilePath = $this->convertToPdf($temporaryFilePath, $file->name);
                    return ['url' => $pdfFilePath];
                case 'word_temp':
                    // Конвертация в PDF
                    $cleanedFilePath = $this->removeImages($temporaryFilePath, $file->name);
                    return ['url' => $cleanedFilePath];
            }
        }
        $url = Storage::disk('public')->url($temporaryFilePath);
        return ['url' => $temporaryFilePath];
    }

    /** @param array{} $args */
    private function removeImages($filePath, $originalFileName)
    {
        // Определите путь для сохранения очищенного файла
        $cleanedFileName = pathinfo($originalFileName, PATHINFO_FILENAME) . '_cleaned.docx';
        $cleanedFilePath = 'temporary/' . Str::random(10) . '_' . $cleanedFileName;

        // Получите полный путь к файлу
        $fullFilePath = Storage::disk('public')->path($filePath);
        $fullCleanedFilePath = Storage::disk('public')->path($cleanedFilePath);

        // Создайте экземпляр PhpWord и загрузите документ
        $phpWord = IOFactory::load($fullFilePath);

        // Обход всех секций и удаление изображений
        foreach ($phpWord->getSections() as $section) {
            foreach ($section->getElements() as $element) {
                if ($element instanceof Image) {
                    $section->removeElement($element);
                }
            }
        }

        // Сохраните очищенный документ
        $writer = IOFactory::createWriter($phpWord, 'Word2007');
        $writer->save($fullCleanedFilePath);

        return $cleanedFilePath;
    }
    private function convertToPdf($temporaryFilePath, $originalFileName)
    {
        // Определите путь для сохранения PDF-файла
        $pdfFileName = pathinfo($originalFileName, PATHINFO_FILENAME) . '.pdf';
        $pdfFilePath = 'temporary/' . Str::random(10) . '_' . $pdfFileName;

        // Получите полный путь к файлу
        $fullTemporaryFilePath = Storage::disk('public')->path($temporaryFilePath);
        $fullPdfFilePath = Storage::disk('public')->path($pdfFilePath);

        // Создайте экземпляр PhpWord
        $phpWord = IOFactory::load($fullTemporaryFilePath);

        // Сохраните в PDF
        $pdfWriter = IOFactory::createWriter($phpWord, 'PDF');
        $pdfWriter->save($fullPdfFilePath);

        // Удалите временный файл, если необходимо
        Storage::disk('public')->delete($temporaryFilePath);

        return Storage::disk('public')->url($pdfFilePath);
    }
}
