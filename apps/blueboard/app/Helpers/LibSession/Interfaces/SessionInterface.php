<?php

namespace App\Helpers\LibSession\Interfaces;
/**
 * Alap session interface
 */
interface SessionInterface
{
    /**
     * String (JSON) formában adja vissza az adott Session-t
     *
     * @return string
     */
    public function toJson(): string;
    /**
     * Új Session instance
     *
     * @param string $hash
     */
    public function __construct(string $hash);
    /**
     * Teljesen új session-t hoz létre
     *
     * @param string $hash
     * Session hash
     * @param integer $expiry
     * Lejárati dátum (unixtime)
     * @param string $salt
     * Session salt
     * @param string $user_salt
     * Felhasznákóhoz tartozó salt
     * @return self
     */
    public static function start(string $hash, int $expiry, string $salt, string $user_salt): self;
    /**
     * Összes jelenleg a session-ben tárolt adat
     *
     * @return object
     */
    public function all(): object;
    /**
     * Medzsik. Törli egy adott kulcshoz tartozó adatokat
     *
     * @param string $name
     * @return void
     */
    public function __unset(string $name): void;
    /**
     * Medzsik. Beállítja / Felülírja egy adott kulcs adatait
     *
     * @param string $name
     * @param mixed $value
     * @return void
     */
    public function __set(string $name, mixed $value): void;
    /**
     * Medzsik. Visszaadja egy adott kulcs adatait.
     *
     * @param string $name
     * @return mixed
     */
    public function __get(string $name): mixed;
}
