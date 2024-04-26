<?php

namespace App\Services;

class MonthEnum
{
    public const JANUARY = ['name' => 'Январь', 'rod_name' => 'Января', 'number' => 1];
    public const FEBRUARY = ['name' => 'Февраль', 'rod_name' => 'Февраля', 'number' => 2];
    public const MARCH = ['name' => 'Март', 'rod_name' => 'Марта', 'number' => 3];
    public const APRIL = ['name' => 'Апрель', 'rod_name' => 'Апреля', 'number' => 4];
    public const MAY = ['name' => 'Май', 'rod_name' => 'Мая', 'number' => 5];
    public const JUNE = ['name' => 'Июнь', 'rod_name' => 'Июня', 'number' => 6];
    public const JULY = ['name' => 'Июль', 'rod_name' => 'Июля', 'number' => 7];
    public const AUGUST = ['name' => 'Август', 'rod_name' => 'Августа', 'number' => 8];
    public const SEPTEMBER = ['name' => 'Сентябрь', 'rod_name' => 'Сентября', 'number' => 9];
    public const OCTOBER = ['name' => 'Октябрь', 'rod_name' => 'Октября', 'number' => 10];
    public const NOVEMBER = ['name' => 'Ноябрь', 'rod_name' => 'Ноября', 'number' => 11];
    public const DECEMBER = ['name' => 'Декабрь', 'rod_name' => 'Декабря', 'number' => 12];

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
    public static function getMonthRodName($number)
    {
        switch ($number) {
            case self::JANUARY['number']: return self::JANUARY['rod_name'];
            case self::FEBRUARY['number']: return self::FEBRUARY['rod_name'];
            case self::MARCH['number']: return self::MARCH['rod_name'];
            case self::APRIL['number']: return self::APRIL['rod_name'];
            case self::MAY['number']: return self::MAY['rod_name'];
            case self::JUNE['number']: return self::JUNE['rod_name'];
            case self::JULY['number']: return self::JULY['rod_name'];
            case self::AUGUST['number']: return self::AUGUST['rod_name'];
            case self::SEPTEMBER['number']: return self::SEPTEMBER['rod_name'];
            case self::OCTOBER['number']: return self::OCTOBER['rod_name'];
            case self::NOVEMBER['number']: return self::NOVEMBER['rod_name'];
            case self::DECEMBER['number']: return self::DECEMBER['rod_name'];
            default: return '';
        }
    }
}


