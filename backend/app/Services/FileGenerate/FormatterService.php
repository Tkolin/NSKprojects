<?php

namespace App\Services\FileGenerate;

use App\Models\Organization;
use App\Services\MonthEnum;
use App\Services\TranslatorNumberToName;
use Exception;

class FormatterService
{
    public static function formatWithLeadingZeros(int $number, int $length): string
    {
        return str_pad((string)$number, $length, '0', STR_PAD_LEFT);
    }

    public static function getMyOrg()
    {
        $myOrg = Organization
            ::with('legal_form')
            ->with('employees')
            ->with('bik')
            ->find(0);
        if (!isset($myOrg)) {
            throw new Exception("Не удалось найти данные об СИБНиПи");
        }
        return $myOrg;
    }

    public static function convertToMany($value, $index = true): string
    {
        $result = number_format($value, 0, ',', ' ') . ($index ? " р." : "");
        return $result;
    }

    public static function convertNumbToStringr($value, $centEnable = true)
    {
        $translator = new TranslatorNumberToName();
        $result = $translator->num2str($value);
        return $result;
    }

    public static function getFullDate($date, $enableHerringboneQuotes = false): string
    {
        if (!isset($date)) {
            throw new Exception("Дата не указана");
        }
        $dateComponents = explode('-', $date);
        $year = $dateComponents[0] ?? "__";
        $month = $dateComponents[1] ? MonthEnum::getMonthRodName($dateComponents[1]) : "__";
        $day = $dateComponents[2] ?? "__";
        return $enableHerringboneQuotes ? "«" . $day . "» " . $month . " " . $year . " г." : $day . ' ' . $month . ' ' . $year . ' г.';
    }

    public static function getShortDate($date): string
    {
        if (!isset($date)) {
            throw new Exception("Дата не указана");
        }
        $dateComponents = explode('-', $date);
        $year = $dateComponents[0] ?? "__";
        $month = $dateComponents[1] ?? "__";
        $day = $dateComponents[2] ?? "__";
        return $day . '.' . $month . '.' . $year . ' г.';
    }

    public static function getAbbreviation($string): string
    {
        if (!isset($string)) {
            error_log("getAbbreviation getter nullable string");
            return "";
        }
        return substr((string)$string, 0, 2);

    }

    public static function getFullName($lastName, $firstName, $patronymic, $short = false, $reverse = false): ?string
    {
        if (!isset($lastName) || !isset($firstName)) {
            error_log("getFullName getter nullable string");
            return null;
        }
        if ($short) {
            if (!$reverse)
                return $lastName . ' ' . FormatterService::getAbbreviation($firstName) . '.' . FormatterService::getAbbreviation($patronymic) . '.';
            else
                return FormatterService::getAbbreviation($firstName) . '.' . FormatterService::getAbbreviation($patronymic) . '.' . " " . $lastName;
        } else {
            if (!$reverse)
                return $lastName . ' ' . $firstName . ' ' . $patronymic;
            else
                return $firstName . ' ' . $lastName . ' ' . $patronymic;
        }
    }

    public static function getFullNameInArray($fio, $short = false): ?string
    {
        if (!isset($fio))
            return null;
        $lastName = $fio['last_name'];
        $firstName = $fio['first_name'];
        $patronymic = $fio['patronymic'];
        return self::getFullName($lastName, $firstName, $patronymic, $short);
    }
}
