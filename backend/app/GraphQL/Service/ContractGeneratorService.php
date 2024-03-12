<?php

namespace App\GraphQL\Service;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpWord\PhpWord;

class ContractGeneratorService
{
    public static function generateContractPerson($personData)
    {
        $phpWord = new PhpWord();
        $section = $phpWord->addSection();

        // Добавьте данные сотрудника в документ
        $section->addText('Имя: ' . $personData["id"]);
        // Добавьте другие данные сотрудника

        // Сохраните документ в папку storage/app
        $fileName = 'contract.docx';
        $filePath = storage_path('app/' . $fileName);
        $phpWord->save($filePath);

        return $fileName;
    }
}
