<?php

namespace App\GraphQL\Service;

use App\Models\Organization;
use App\Models\Person;
use App\Models\TemplateFile;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\TemplateProcessor;

class GeneratorService
{
    public static  function getOrganizationData()
    {
        return Organization
        ::with('legal_form')
        ->with('contacts')
        ->with('bik')
        ->find(0);
    }
}
