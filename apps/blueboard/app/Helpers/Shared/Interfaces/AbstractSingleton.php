<?php

namespace App\Helpers\Shared\Interfaces;

abstract class AbstractSingleton implements ReportsStatus
{
    /**
     * Aktív -e a service vagy nem
     *
     * @var boolean
     */
    protected bool $active = false;

    /**
     * A jelenleg regisztrált singleton-t adja vissza
     *
     * @return self
     */
    abstract public static function use(): self;

    /**
     * Aktív -e a service vagy nem (getter edition)
     *
     * @var boolean
     */
    public function active(): bool
    {
        return $this->active;
    }
}
