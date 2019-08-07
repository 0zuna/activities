<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('login', 'AuthController@login');
Route::post('signup', 'AuthController@signup');

Route::group(['middleware' => 'auth:api'], function() {
	Route::get('logout', 'AuthController@logout');
	Route::post('upexcel', 'ExcelController@index');
	Route::get('data', 'AdminController@index');
	Route::get('users', 'AdminController@users');
	Route::post('jefe_dep', 'AdminController@jefe_dep');
	Route::post('jefe_div', 'AdminController@jefe_div');
	Route::post('actividad_user', 'AdminController@actividad_user');
	Route::post('newActivityToUser', 'AdminController@newActivityToUser');
	Route::put('updateActivity', 'AdminController@updateActivity');
	Route::post('newSubActivity', 'AdminController@newSubActivity');
	Route::post('assignActivity', 'AdminController@assignActivity');
	Route::post('unAssignActivity', 'AdminController@unAssignActivity');
	Route::post('newActivity', 'AdminController@newActivity');
	Route::post('pushJerarquia', 'AdminController@pushJerarquia');
	Route::put('updateJerarquia', 'AdminController@updateJerarquia');
	Route::post('actividadJerarquia', 'AdminController@actividadJerarquia');
	Route::post('deleteJerarquia', 'AdminController@deleteJerarquia');
});
