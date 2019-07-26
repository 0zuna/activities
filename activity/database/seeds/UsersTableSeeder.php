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
	$user->name='Erik';
	$user->email='erik@gmail.com';
        $user->password= bcrypt('1');
	$user->save();
	factory(App\User::class,100)->create();

    }
}
