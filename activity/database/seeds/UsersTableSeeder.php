<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Faker\Generator as Faker;


class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
	$user=new App\User();
	$user->name='Erik Admin';
	$user->email='admin@usupso.com.mx';
	$user->rol='admin';
        $user->password= bcrypt('1');
	$user->save();

	$user=new App\User();
	$user->name='Karla';
	$user->email='imagen@usupso.com.mx';
	$user->rol='empleado';
        $user->password= bcrypt('hola');
	$user->save();

	$user=new App\User();
	$user->name='Ernesto';
	$user->email='proyectos@usupso.com.mx';
	$user->rol='empleado';
        $user->password= bcrypt('hola');
	$user->save();

	$user=new App\User();
	$user->name='Laura';
	$user->email='contabilidad@usupso.com.mx';
	$user->rol='empleado';
        $user->password= bcrypt('hola');
	$user->save();

	$user=new App\User();
	$user->name='Jorge';
	$user->email='jorge.mendoza@usupso.com.mx';
	$user->rol='admin';
        $user->password= bcrypt('hola');
	$user->save();

	$user=new App\User();
	$user->name='Alvaro';
	$user->email='alvaro.jimenez@usupso.com.mx';
	$user->rol='admin';
        $user->password= bcrypt('hola');
	$user->save();
	//factory(App\User::class,100)->create();

    }
}
