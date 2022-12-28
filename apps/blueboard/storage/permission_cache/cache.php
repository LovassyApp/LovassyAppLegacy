<?php
return array (
  'permission_resolutions' => 
  array (
    'Products::UpdateProduct' => 'App\\Permissions\\Products\\UpdateProduct',
    'Products::CreateProduct' => 'App\\Permissions\\Products\\CreateProduct',
    'Products::DeleteProduct' => 'App\\Permissions\\Products\\DeleteProduct',
    'Products::ViewProducts' => 'App\\Permissions\\Products\\ViewProducts',
    'Products::ShowProduct' => 'App\\Permissions\\Products\\ShowProduct',
    'General::Grades' => 'App\\Permissions\\General\\Grades',
    'General::Control' => 'App\\Permissions\\General\\Control',
    'General::Lolo' => 'App\\Permissions\\General\\Lolo',
    'Permissions::DeleteGroup' => 'App\\Permissions\\Permissions\\DeleteGroup',
    'Permissions::CreateGroup' => 'App\\Permissions\\Permissions\\CreateGroup',
    'Permissions::ShowGroup' => 'App\\Permissions\\Permissions\\ShowGroup',
    'Permissions::ViewPermissions' => 'App\\Permissions\\Permissions\\ViewPermissions',
    'Permissions::UpdateGroup' => 'App\\Permissions\\Permissions\\UpdateGroup',
    'Permissions::ViewGroups' => 'App\\Permissions\\Permissions\\ViewGroups',
    'QRCode::CreateQRCode' => 'App\\Permissions\\QRCode\\CreateQRCode',
    'QRCode::ValidateQRCode' => 'App\\Permissions\\QRCode\\ValidateQRCode',
    'QRCode::ViewQRCodes' => 'App\\Permissions\\QRCode\\ViewQRCodes',
    'QRCode::DeleteQRCode' => 'App\\Permissions\\QRCode\\DeleteQRCode',
    'Requests::ViewOwnRequests' => 'App\\Permissions\\Requests\\ViewOwnRequests',
    'Requests::ViewRequests' => 'App\\Permissions\\Requests\\ViewRequests',
    'Requests::CreateRequest' => 'App\\Permissions\\Requests\\CreateRequest',
    'Requests::OverruleRequest' => 'App\\Permissions\\Requests\\OverruleRequest',
    'Inventory::ViewInventory' => 'App\\Permissions\\Inventory\\ViewInventory',
    'Inventory::UseItem' => 'App\\Permissions\\Inventory\\UseItem',
    'Users::ShowUser' => 'App\\Permissions\\Users\\ShowUser',
    'Users::DeleteUser' => 'App\\Permissions\\Users\\DeleteUser',
    'Users::UpdateUser' => 'App\\Permissions\\Users\\UpdateUser',
    'Users::ViewUsers' => 'App\\Permissions\\Users\\ViewUsers',
    'Store::BuyProduct' => 'App\\Permissions\\Store\\BuyProduct',
    'Store::ViewStore' => 'App\\Permissions\\Store\\ViewStore',
  ),
  'permission_resolutions_flipped' => 
  array (
    'App\\Permissions\\Products\\UpdateProduct' => 'Products::UpdateProduct',
    'App\\Permissions\\Products\\CreateProduct' => 'Products::CreateProduct',
    'App\\Permissions\\Products\\DeleteProduct' => 'Products::DeleteProduct',
    'App\\Permissions\\Products\\ViewProducts' => 'Products::ViewProducts',
    'App\\Permissions\\Products\\ShowProduct' => 'Products::ShowProduct',
    'App\\Permissions\\General\\Grades' => 'General::Grades',
    'App\\Permissions\\General\\Control' => 'General::Control',
    'App\\Permissions\\General\\Lolo' => 'General::Lolo',
    'App\\Permissions\\Permissions\\DeleteGroup' => 'Permissions::DeleteGroup',
    'App\\Permissions\\Permissions\\CreateGroup' => 'Permissions::CreateGroup',
    'App\\Permissions\\Permissions\\ShowGroup' => 'Permissions::ShowGroup',
    'App\\Permissions\\Permissions\\ViewPermissions' => 'Permissions::ViewPermissions',
    'App\\Permissions\\Permissions\\UpdateGroup' => 'Permissions::UpdateGroup',
    'App\\Permissions\\Permissions\\ViewGroups' => 'Permissions::ViewGroups',
    'App\\Permissions\\QRCode\\CreateQRCode' => 'QRCode::CreateQRCode',
    'App\\Permissions\\QRCode\\ValidateQRCode' => 'QRCode::ValidateQRCode',
    'App\\Permissions\\QRCode\\ViewQRCodes' => 'QRCode::ViewQRCodes',
    'App\\Permissions\\QRCode\\DeleteQRCode' => 'QRCode::DeleteQRCode',
    'App\\Permissions\\Requests\\ViewOwnRequests' => 'Requests::ViewOwnRequests',
    'App\\Permissions\\Requests\\ViewRequests' => 'Requests::ViewRequests',
    'App\\Permissions\\Requests\\CreateRequest' => 'Requests::CreateRequest',
    'App\\Permissions\\Requests\\OverruleRequest' => 'Requests::OverruleRequest',
    'App\\Permissions\\Inventory\\ViewInventory' => 'Inventory::ViewInventory',
    'App\\Permissions\\Inventory\\UseItem' => 'Inventory::UseItem',
    'App\\Permissions\\Users\\ShowUser' => 'Users::ShowUser',
    'App\\Permissions\\Users\\DeleteUser' => 'Users::DeleteUser',
    'App\\Permissions\\Users\\UpdateUser' => 'Users::UpdateUser',
    'App\\Permissions\\Users\\ViewUsers' => 'Users::ViewUsers',
    'App\\Permissions\\Store\\BuyProduct' => 'Store::BuyProduct',
    'App\\Permissions\\Store\\ViewStore' => 'Store::ViewStore',
  ),
  'scope_cache' => 
  array (
    'Products' => 
    array (
      0 => 
      (object) array(
         'displayName' => 'Szerkesztés',
         'permissionString' => 'Products::UpdateProduct',
         'description' => 'Egy adott termék szerkesztése',
         'permission' => 'UpdateProduct',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      1 => 
      (object) array(
         'displayName' => 'Létrehozás',
         'permissionString' => 'Products::CreateProduct',
         'description' => 'Új termék létrehozása',
         'permission' => 'CreateProduct',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      2 => 
      (object) array(
         'displayName' => 'Törlés',
         'permissionString' => 'Products::DeleteProduct',
         'description' => 'Egy adott termék törlése',
         'permission' => 'DeleteProduct',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      3 => 
      (object) array(
         'displayName' => 'Listázás',
         'permissionString' => 'Products::ViewProducts',
         'description' => 'Terméklista megtekintése',
         'permission' => 'ViewProducts',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      4 => 
      (object) array(
         'displayName' => 'Termék lekérése',
         'permissionString' => 'Products::ShowProduct',
         'description' => 'Egy adott termék adatainak lekérése',
         'permission' => 'ShowProduct',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
    ),
    'General' => 
    array (
      0 => 
      (object) array(
         'displayName' => 'Jegyek',
         'permissionString' => 'General::Grades',
         'description' => 'Jegyek oldal megtekintése',
         'permission' => 'Grades',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      1 => 
      (object) array(
         'displayName' => 'Control',
         'permissionString' => 'General::Control',
         'description' => 'Én ezt nem venném el. Megbénítja az adott csoport minden felhasználóját.',
         'permission' => 'Control',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      2 => 
      (object) array(
         'displayName' => 'LoLó',
         'permissionString' => 'General::Lolo',
         'description' => 'LoLó oldal megtekintése',
         'permission' => 'Lolo',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
    ),
    'Permissions' => 
    array (
      0 => 
      (object) array(
         'displayName' => 'Törlés',
         'permissionString' => 'Permissions::DeleteGroup',
         'description' => 'Egy adott csoport törlése',
         'permission' => 'DeleteGroup',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      1 => 
      (object) array(
         'displayName' => 'Létrehozás',
         'permissionString' => 'Permissions::CreateGroup',
         'description' => 'Új csoport létrehozása',
         'permission' => 'CreateGroup',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      2 => 
      (object) array(
         'displayName' => 'Csoport lekérése',
         'permissionString' => 'Permissions::ShowGroup',
         'description' => 'Egy adott csoport adatainak lekérése (Boardlight beépített szerkesztőjéhez kell!)',
         'permission' => 'ShowGroup',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      3 => 
      (object) array(
         'displayName' => 'Jogosultságok lekérése',
         'permissionString' => 'Permissions::ViewPermissions',
         'description' => 'A rendszerben lévő összes jogosultság lekérése (Boardlight beépített szerkesztőjéhez kell!)',
         'permission' => 'ViewPermissions',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      4 => 
      (object) array(
         'displayName' => 'Szerkesztés',
         'permissionString' => 'Permissions::UpdateGroup',
         'description' => 'Egy adott csoport adatainak szerkesztése',
         'permission' => 'UpdateGroup',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      5 => 
      (object) array(
         'displayName' => 'Listázás',
         'permissionString' => 'Permissions::ViewGroups',
         'description' => 'Csoportlista megtekintése',
         'permission' => 'ViewGroups',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
    ),
    'QRCode' => 
    array (
      0 => 
      (object) array(
         'displayName' => 'Létrehozás',
         'permissionString' => 'QRCode::CreateQRCode',
         'description' => 'Aktiváló QR kód létrehozása',
         'permission' => 'CreateQRCode',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      1 => 
      (object) array(
         'displayName' => 'Ellenőrzés',
         'permissionString' => 'QRCode::ValidateQRCode',
         'description' => 'Aktiváló QR kód hitelességének ellenőrzése beváltáskor',
         'permission' => 'ValidateQRCode',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      2 => 
      (object) array(
         'displayName' => 'Listázás',
         'permissionString' => 'QRCode::ViewQRCodes',
         'description' => 'Aktiváló QR kód lista megtekintése',
         'permission' => 'ViewQRCodes',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      3 => 
      (object) array(
         'displayName' => 'Törlés',
         'permissionString' => 'QRCode::DeleteQRCode',
         'description' => 'Aktiváló QR kód törlése',
         'permission' => 'DeleteQRCode',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
    ),
    'Requests' => 
    array (
      0 => 
      (object) array(
         'displayName' => 'Listázás (saját)',
         'permissionString' => 'Requests::ViewOwnRequests',
         'description' => 'Saját kérvények listájának megtekintése',
         'permission' => 'ViewOwnRequests',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      1 => 
      (object) array(
         'displayName' => 'Listázás',
         'permissionString' => 'Requests::ViewRequests',
         'description' => 'Kérvénylista megtekintése',
         'permission' => 'ViewRequests',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      2 => 
      (object) array(
         'displayName' => 'Benyújtás',
         'permissionString' => 'Requests::CreateRequest',
         'description' => 'Új kérvény benyújtása',
         'permission' => 'CreateRequest',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      3 => 
      (object) array(
         'displayName' => 'Elbírálás',
         'permissionString' => 'Requests::OverruleRequest',
         'description' => 'Egy adott kérvény elutasítása vagy elfogadása',
         'permission' => 'OverruleRequest',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
    ),
    'Inventory' => 
    array (
      0 => 
      (object) array(
         'displayName' => 'Listázás',
         'permissionString' => 'Inventory::ViewInventory',
         'description' => 'Kincstár megtekintése',
         'permission' => 'ViewInventory',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      1 => 
      (object) array(
         'displayName' => 'Felhasználás',
         'permissionString' => 'Inventory::UseItem',
         'description' => 'Birtokolt tárgyak felhasználása',
         'permission' => 'UseItem',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
    ),
    'Users' => 
    array (
      0 => 
      (object) array(
         'displayName' => 'Felhasználó lekérése',
         'permissionString' => 'Users::ShowUser',
         'description' => 'Egy adott felhasználó adatainak lekérése (Boardlight beépített szerkesztőjéhez kell!)',
         'permission' => 'ShowUser',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      1 => 
      (object) array(
         'displayName' => 'Törlés',
         'permissionString' => 'Users::DeleteUser',
         'description' => 'Egy adott felhasználó törlése',
         'permission' => 'DeleteUser',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      2 => 
      (object) array(
         'displayName' => 'Szerkesztés',
         'permissionString' => 'Users::UpdateUser',
         'description' => 'Egy adott felhasználó adatainak szerkesztése',
         'permission' => 'UpdateUser',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      3 => 
      (object) array(
         'displayName' => 'Listázás',
         'permissionString' => 'Users::ViewUsers',
         'description' => 'Felhasználói lista megtekintése',
         'permission' => 'ViewUsers',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
    ),
    'Store' => 
    array (
      0 => 
      (object) array(
         'displayName' => 'Vásárlás',
         'permissionString' => 'Store::BuyProduct',
         'description' => 'Termékek vásárlása a bazárban',
         'permission' => 'BuyProduct',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
      1 => 
      (object) array(
         'displayName' => 'Listázás',
         'permissionString' => 'Store::ViewStore',
         'description' => 'Bazár termékeinek listázása',
         'permission' => 'ViewStore',
         'errorMessage' => 'You don\'t have permission to use this object.',
      ),
    ),
  ),
);
