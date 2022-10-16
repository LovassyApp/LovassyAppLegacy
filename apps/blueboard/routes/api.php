<?php

use Illuminate\Broadcasting\BroadcastController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/* Route::get('/', function (Request $request) {
    return view('welcome');
});
*/
Route::get('/test', 'TestController@index');

// Authentikáció
Route::post('/login', 'AuthController@login');
Route::get('/login', 'AuthController@loginWithCookie');
Route::get('/logout', 'AuthController@destroyCookie');
Route::post('/register', 'AuthController@register');

// Csak session-nel
Route::middleware(['auth:sanctum'])->group(function () {
    // Socket auth
    Route::get('/broadcasting/auth', [BroadcastController::class, 'authenticate']);
    Route::post('/broadcasting/auth', [BroadcastController::class, 'authenticate']);

    // Frontend control
    Route::get('/control', 'FrontendControlController@index');

    // Eager loading stuff
    Route::get('/boot', 'EagerLoadController@index');

    // Kretás cuccok
    Route::get('/kreta/grades', 'GradeController@index');
    Route::get('/lolo', 'LoloGetController@index');

    // Permissions / User groupok
    Route::get('/permissions/groups', 'PermissionController@index');
    Route::get('/permissions/list', 'PermissionController@getPermissions');
    Route::put('/permissions/groups', 'PermissionController@save');
    Route::patch('/permissions/groups', 'PermissionController@update');
    Route::delete('/permissions/groups', 'PermissionController@delete');
    Route::get('/permissions/groups/{id}', 'PermissionController@getGroup');

    // Users
    Route::get('/users', 'UserController@index');
    Route::get('/users/{id}', 'UserController@show');
    Route::patch('/users', 'UserController@update');
    Route::delete('/users', 'UserController@delete');

    // QRCodes
    Route::get('/qrcodes', 'QRCodeController@index');
    Route::put('/qrcodes', 'QRCodeController@create');
    Route::delete('/qrcodes', 'QRCodeController@delete');

    // Products
    Route::get('/products', 'ProductController@index');
    Route::get('/products/{id}', 'ProductController@show');
    Route::put('/products', 'ProductController@create');
    Route::patch('/products', 'ProductController@update');
    Route::delete('/products', 'ProductController@delete');

    // Store
    Route::get('/store', 'StoreController@index');
    Route::post('/store', 'StoreController@buy');

    // Inventory
    Route::get('/inventory', 'InventoryController@index');
    Route::post('/inventory', 'InventoryController@validateCode');
    Route::patch('/inventory', 'InventoryController@useItem');

    // Requests
    Route::get('/lolo/requests', 'LoloRequestController@show');
    Route::put('/lolo/requests', 'LoloRequestController@create');
    Route::get('/lolo/requests/all', 'LoloRequestController@index');
    Route::patch('/lolo/requests/all', 'LoloRequestController@update');
});

Route::get('/qrcodes/view/{image}', 'QRCodeController@show')
    ->name('qrimage')
    ->middleware('signed');

Route::get('/products/image/{productID}', 'ProductController@view')
    ->name('productimage')
    ->middleware('signed');

Route::get('/status', 'VersionController@status');

Route::get('/version', 'VersionController@index');
