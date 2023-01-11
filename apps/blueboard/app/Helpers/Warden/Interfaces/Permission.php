<?php

namespace App\Helpers\Warden\Interfaces;

use App\Helpers\Warden\Constants\ConfigDefaults;

/**
 * An abstract class implementing the basic functionality of a Permission
 * @package Warden
 */
abstract class Permission
{
    /**
     * The name of the Permission, set in its constructor
     *
     * @var string
     */
    protected string $name;

    /**
     * The description of the Permission, set in its constructor
     *
     * @var string
     */
    protected string $description;

    /**
     * The default error message used when throwing unauthorized
     * exceptions, set in the permission's constructor
     *
     * @var string
     */
    protected string $defaultErrorMessage;

    /**
     * Abstract function for constructing, needs to be implemented in each Permission
     */
    abstract public function __construct();

    /**
     * Static method that returns a new instance of the Permission
     *
     * @return static
     */
    public static function use(): static
    {
        return new static();
    }

    /**
     * The Permission's identifier
     *
     * @return string
     */
    public function identifier(): string
    {
        return class_basename($this);
    }

    /**
     * The default access denied message from the config
     *
     * @return string
     */
    protected function default_message(): string
    {
        return config('warden.page_denied', ConfigDefaults::PAGE_DENIED);
    }

    /**
     * The scope which the Permission belongs to
     *
     * @return string
     */
    public function scope(): string
    {
        $arr = explode('\\', get_called_class());
        $key = array_key_last($arr);
        return $arr[$key - 1] ?? $arr[$key];
    }

    /**
     * The Permission's permissionString (scope::identifier)
     *
     * @return string
     */
    public function permissionString(): string
    {
        return "{$this->scope()}::{$this->identifier()}";
    }

    /**
     * The Permission's name
     *
     * @return string
     */
    public function name(): string
    {
        return $this->name;
    }

    /**
     * The Permission's description
     *
     * @return string
     */
    public function description(): string
    {
        return $this->description;
    }

    /**
     * The Permission's default error message
     *
     * @return string
     */
    public function defaultErrorMessage(): string
    {
        return $this->defaultErrorMessage;
    }
}
