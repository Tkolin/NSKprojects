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
        return str_pad((string) $number, $length, '0', STR_PAD_LEFT);
    }

    public static function mb_ucfirst($text)
    {
        return mb_strtoupper(mb_substr($text, 0, 1)) . mb_substr($text, 1);
    }

    public static function formattedPhone($number)
    {
        return preg_replace('/\+(\d{1,2})?(\d{3})(\d{3})(\d{2})(\d{2})/', '+$1 ($2) $3-$4-$5', $number);
    }
    public static function formattedMoney($number)
    {
        // Форматируем число: 
        // 1. первый параметр — само число
        // 2. второй параметр — количество десятичных знаков (2)
        // 3. третий параметр — разделитель для десятичных знаков (",")
        // 4. четвертый параметр — разделитель тысяч (" ")
        return number_format($number, 2, ',', ' ');
    }
    public static function removeFirstPartBeforeComma($address)
    {
        if (!$address) {
            return "_____";
        }

        $pos = strpos($address, ',');
        if ($pos !== false) {
            return trim(substr($address, $pos + 1));
        }

        return $address;
    }

    public static function formatDuration($days): string
    {
        $months = floor($days / 30); // Рассчитываем количество месяцев
        $remainingDays = $days % 30; // Оставшиеся дни

        // Формируем строку для месяцев
        if ($months > 0) {
            if ($months == 1) {
                $monthString = "$months месяц";
            } elseif ($months >= 2 && $months <= 4) {
                $monthString = "$months месяца";
            } else {
                $monthString = "$months месяцев";
            }
        } else {
            $monthString = '';
        }

        // Формируем строку для дней
        if ($remainingDays > 0) {
            if ($remainingDays == 1) {
                $dayString = "$remainingDays день";
            } elseif ($remainingDays >= 2 && $remainingDays <= 4) {
                $dayString = "$remainingDays дня";
            } else {
                $dayString = "$remainingDays дней";
            }
        } else {
            $dayString = '';
        }

        // Объединяем результаты
        if ($monthString && $dayString) {
            return "$monthString и $dayString";
        } elseif ($monthString) {
            return $monthString;
        } else {
            return $dayString;
        }
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

    public static function convertToMany($value, $index = true, $customIndex = null)
    {
        $result = number_format($value, 0, ',', ' ') . $customIndex ? $customIndex : ($index ? " р." : "");
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
            return "Дата не указана";
        }
        $dateComponents = explode('-', $date);
        $year = $dateComponents[0] ?? "__";
        $month = $dateComponents[1] ? mb_strtolower(MonthEnum::getMonthRodName($dateComponents[1])) : "__";
        $day = $dateComponents[2] ?? "__";
        return $enableHerringboneQuotes ? "«" . $day . "» " . $month . " " . $year . " г." : $day . ' ' . $month . ' ' . $year . ' г.';
    }

    public static function getShortDate($date): string
    {
        if (!isset($date)) {
            return "Дата не указана";
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
        return substr((string) $string, 0, 2);

    }

    public static function getFullName($lastName, $firstName, $patronymic, $short = false, $reverse = false): ?string
    {
        // Проверка на обязательные параметры
        if (!isset($lastName) || !isset($firstName)) {
            error_log("getFullName getter nullable string");
            return null;
        }

        // Если требуется краткое имя
        if ($short) {
            // Если отчество отсутствует, не добавляем его в сокращенный вид
            if (empty($patronymic)) {
                // Без отчества
                if (!$reverse)
                    return $lastName . ' ' . FormatterService::getAbbreviation($firstName) . '.';
                else
                    return FormatterService::getAbbreviation($firstName) . '.' . " " . $lastName;
            } else {
                // С отчество
                if (!$reverse)
                    return $lastName . ' ' . FormatterService::getAbbreviation($firstName) . '.' . FormatterService::getAbbreviation($patronymic) . '.';
                else
                    return FormatterService::getAbbreviation($firstName) . '.' . FormatterService::getAbbreviation($patronymic) . '.' . " " . $lastName;
            }
        } else {
            // Полное имя
            if (empty($patronymic)) {
                // Без отчества
                if (!$reverse)
                    return $lastName . ' ' . $firstName;
                else
                    return $firstName . ' ' . $lastName;
            } else {
                // С отчество
                if (!$reverse)
                    return $lastName . ' ' . $firstName . ' ' . $patronymic;
                else
                    return $firstName . ' ' . $lastName . ' ' . $patronymic;
            }
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
