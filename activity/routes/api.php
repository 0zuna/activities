<?php

use Illuminate\Http\Request;

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group(['prefix' => 'auth'], function () {
    Route::post('login', 'AuthController@login');
    Route::post('signup', 'AuthController@signup');

    Route::group(['middleware' => 'auth:api'], function() {
	Route::get('logout', 'AuthController@logout');
	Route::post('upexcel', 'ExcelController@index');
	Route::get('data', 'AdminController@index');
	Route::get('users', 'AdminController@users');
	Route::post('jefe_dep', 'AdminController@jefe_dep');
	Route::post('actividad_user', 'AdminController@actividad_user');
	Route::post('newActivity', 'AdminController@newActivity');
    });
});
