<?php

namespace App\Services\FileGenerate;

use App\Models\Organization;
use App\Services\MonthEnum;
use PhpOffice\PhpWord\TemplateProcessor;

class GeneratorService
{

    public static  function getOrganizationData()
    {
        return Organization
            ::with('legal_form')
            ->with('employees')
            ->with('bik')
            ->find(0);
    }



}
