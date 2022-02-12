<?php

namespace App\Helpers\PermissionManager;

/**
 * Container class for permissions
 * Constant arrays define the lists, with one additional array for Scopes.
 * Simply put: Basically a weird access-control-list thing
 * Class Permissions
 * @package App\Helpers\PermissionManager
 *
 */
class Permissions
{
    public static function getAllPermissions()
    {
        $arr = [];

        foreach (self::SCOPES as $key => $scopeName) {
            $scope = eval("return App\Helpers\PermissionManager\Permissions::$scopeName;");
            foreach ($scope as $permission) {
                $permString = "$key.{$permission['permission']}";
                array_push($arr, $permString);
            }
        }

        return $arr;
    }

    /**
     *
     * Default denied message
     * @var string
     *
     */
    private const PAGE_DENIED = "You don't have permission to use this object.";

    /**
     *
     * A place for Permission Scopes
     * All constants MUST have a corresponding scope and vice-versa.
     * @var string[]
     */
    public const SCOPES = [
        // 'DisplayName' => 'Assigned constant'
        'General' => 'MISC',
        'Users' => 'USERS',
        'Permissions' => 'PERMISSIONS',
        'QRCode' => 'QR',
        'Products' => 'PRODUCTS',
        //'Shop' => 'SHOP',
        //'Inventory' => 'INVENTORY',
        //'QRCode' => 'QRCODE',
        //'Users' => 'USERS',
        //'Permissions' => 'PERMISSIONS',
        //'Settings' => 'Settings',
    ];

    /**
     *
     */
    public const MISC = [
        'home' => [
            'permission' => 'home',
            'displayName' => 'Home',
            'description' => 'Home oldal megtekintése',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'grades' => [
            'permission' => 'grades',
            'displayName' => 'Jegyek',
            'description' => 'Jegyek oldal megtekintése',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'settings' => [
            'permission' => 'settings',
            'displayName' => 'Beállítások',
            'description' => 'Felhasználói beállítások változtatása',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'control' => [
            'permission' => 'control',
            'displayName' => 'Control',
            'description' => 'ÉN EZT NEM VENNÉM EL, MEGBÉNÍTJA AZ ADOTT CSOPORT MINDEN USERÉT!',
            'errorMessage' => self::PAGE_DENIED,
        ],
    ];

    /**
     *
     */
    public const USERS = [
        'view' => [
            'permission' => 'view',
            'displayName' => 'Listázás',
            'description' => 'Felhasználói lista megtekintése',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'viewuser' => [
            'permission' => 'viewuser',
            'displayName' => 'Felhasználó lekérése',
            'description' => 'Egy adott felhasználó adatainak lekérése',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'update' => [
            'permission' => 'update',
            'displayName' => 'Szerkesztés',
            'description' => 'Egy adott felhasználó adatainak szerkesztése',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'delete' => [
            'permission' => 'delete',
            'displayName' => 'Törlés',
            'description' => 'Egy adott felhasználó törlése',
            'errorMessage' => self::PAGE_DENIED,
        ],
    ];

    /**
     *
     */
    public const PERMISSIONS = [
        'view' => [
            'permission' => 'view',
            'displayName' => 'Listázás',
            'description' => 'Csoportlista megtekintése',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'viewgroup' => [
            'permission' => 'viewgroup',
            'displayName' => 'Csoport lekérése',
            'description' => 'Egy adott csoport adatainak lekérése',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'getpermissions' => [
            'permission' => 'getpermissions',
            'displayName' => 'Jogosultságok lekérése',
            'description' => 'A rendszerben lévő összes jogosultság lekérése',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'update' => [
            'permission' => 'update',
            'displayName' => 'Szerkesztés',
            'description' => 'Egy adott csoport adatainak szerkesztése',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'add' => [
            'permission' => 'add',
            'displayName' => 'Létrehozás',
            'description' => 'Új csoport létrehozása',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'delete' => [
            'permission' => 'delete',
            'displayName' => 'Törlés',
            'description' => 'Egy adott csoport törlése',
            'errorMessage' => self::PAGE_DENIED,
        ],
    ];

    /**
     *
     */
    public const QR = [
        'view' => [
            'permission' => 'view',
            'displayName' => 'Listázás',
            'description' => 'Aktiváló QR kód lista megtekintése',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'add' => [
            'permission' => 'add',
            'displayName' => 'Hozzáadás',
            'description' => 'Aktiváló QR Kód hozzáadása',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'delete' => [
            'permission' => 'delete',
            'displayName' => 'Törlés',
            'description' => 'Aktiváló QR Kód törlése',
            'errorMessage' => self::PAGE_DENIED,
        ],
    ];

    /**
     *
     */
    public const PRODUCTS = [
        'index' => [
            'permission' => 'index',
            'displayName' => 'Listázás',
            'description' => 'Terméklista megtekintése',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'show' => [
            'permission' => 'show',
            'displayName' => 'Termék lekérése',
            'description' => 'Egy adott termék adatainak lekérése',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'create' => [
            'permission' => 'create',
            'displayName' => 'Hozzáadás',
            'description' => 'Új termék hozzáadása',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'update' => [
            'permission' => 'update',
            'displayName' => 'Hozzáadás',
            'description' => 'Egy adott termék szerkesztése',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'delete' => [
            'permission' => 'delete',
            'displayName' => 'Törlés',
            'description' => 'Egy adott termék törlése',
            'errorMessage' => self::PAGE_DENIED,
        ],
        'uses' => [
            'permission' => 'uses',
            'displayName' => 'Felhasználások',
            'description' => 'Egy adott termék felhasználásainak megtekintése, annak kitöltési adataival együtt',
            'errorMessage' => self::PAGE_DENIED,
        ],
    ];
}
