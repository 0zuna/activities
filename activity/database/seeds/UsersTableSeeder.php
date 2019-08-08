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
	$user->email='admin@usupso.com';
	$user->rol='admin';
        $user->password= bcrypt('1');
	$user->save();
	$user=new App\User();
	$user->name='Erik Empleado';
	$user->email='empleado@usupso.com';
	$user->rol='empleado';
        $user->password= bcrypt('1');
	$user->save();
	factory(App\User::class,100)->create();

    }
}
