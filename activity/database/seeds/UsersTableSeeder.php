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
	$user->paterno='Lira';
	$user->materno='Santiago';
	$user->puesto='Diseño Grafico';
	$user->celular='3314950487';
        $user->password= bcrypt('hola');
	$user->save();

	$user=new App\User();
	$user->name='Ernesto';
	$user->email='proyectos@usupso.com.mx';
	$user->paterno='Valtierra';
	$user->materno='Robles';
	$user->puesto='Arquitecto';
	$user->celular='3331725090';
	$user->rol='empleado';
        $user->password= bcrypt('hola');
	$user->save();

	$user=new App\User();
	$user->name='Laura';
	$user->email='contabilidad@usupso.com.mx';
	$user->paterno='Justo';
	$user->materno='Reynoso';
	$user->puesto='Contador';
	$user->celular='3322573579';
	$user->rol='empleado';
        $user->password= bcrypt('hola');
	$user->save();

	$user=new App\User();
	$user->name='Jorge';
	$user->email='jorge.mendoza@usupso.com.mx';
	$user->paterno='Mendoza';
	$user->materno='Santigo';
	$user->puesto='Administrador';
	$user->celular='3314153248';
	$user->rol='admin';
        $user->password= bcrypt('hola');
	$user->save();

	$user=new App\User();
	$user->name='Alvaro';
	$user->email='alvaro.jimenez@usupso.com.mx';
	$user->paterno='Jimenez';
	$user->materno='Romero';
	$user->puesto='Dirección Administrativa';
	$user->celular='3313194284';
	$user->rol='admin';
        $user->password= bcrypt('hola');
	$user->save();

	$user=new App\User();
	$user->name='Leo Arturo';
	$user->email='leo.jimenez@usupso.com.mx';
	$user->paterno='Jimenez';
	$user->materno='Romero';
	$user->puesto='Dirección Comercial';
	$user->celular='3315485858';
	$user->rol='admin';
        $user->password= bcrypt('hola');
	$user->save();

	$user=new App\User();
	$user->name='Sofia';
	$user->paterno='Ventura';
	$user->materno='Pineda';
	$user->email='compras@usupso.com.mx';
	$user->rol='empleado';
	$user->celular='3328397922';
        $user->password= bcrypt('hola');
	$user->save();
	//factory(App\User::class,100)->create();

    }
}
