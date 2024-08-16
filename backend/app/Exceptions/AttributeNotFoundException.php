<?php

namespace App\Exceptions;

use Exception;

class AttributeNotFoundException extends Exception
{
    protected $attribute;

    public function __construct($attribute, $code = 0, Exception $previous = null)
    {
        $this->attribute = $attribute;
        parent::__construct("Attribute '{$attribute}' not found.", $code, $previous);
        parent::__construct("Attribute '{$attribute}' not found.", $code, $previous);
    }

    public function getAttribute()
    {
        return $this->attribute;
    }
}
