<?php

namespace App\GraphQL\Service;

use ReflectionClass;
class MonthEnum
{
    public const JANUARY = ['name' => 'Январь', 'number' => 1];
    public const FEBRUARY = ['name' => 'Февраль', 'number' => 2];
    public const MARCH = ['name' => 'Март', 'number' => 3];
    public const APRIL = ['name' => 'Апрель', 'number' => 4];
    public const MAY = ['name' => 'Май', 'number' => 5];
    public const JUNE = ['name' => 'Июнь', 'number' => 6];
    public const JULY = ['name' => 'Июль', 'number' => 7];
    public const AUGUST = ['name' => 'Август', 'number' => 8];
    public const SEPTEMBER = ['name' => 'Сентябрь', 'number' => 9];
    public const OCTOBER = ['name' => 'Октябрь', 'number' => 10];
    public const NOVEMBER = ['name' => 'Ноябрь', 'number' => 11];
    public const DECEMBER = ['name' => 'Декабрь', 'number' => 12];

    public static function getMonthName($number)
    {
        switch ($number) {
            case self::JANUARY['number']: return self::JANUARY['name'];
            case self::FEBRUARY['number']: return self::FEBRUARY['name'];
            case self::MARCH['number']: return self::MARCH['name'];
            case self::APRIL['number']: return self::APRIL['name'];
            case self::MAY['number']: return self::MAY['name'];
            case self::JUNE['number']: return self::JUNE['name'];
            case self::JULY['number']: return self::JULY['name'];
            case self::AUGUST['number']: return self::AUGUST['name'];
            case self::SEPTEMBER['number']: return self::SEPTEMBER['name'];
            case self::OCTOBER['number']: return self::OCTOBER['name'];
            case self::NOVEMBER['number']: return self::NOVEMBER['name'];
            case self::DECEMBER['number']: return self::DECEMBER['name'];
            default: return '';
        }
    }
}


