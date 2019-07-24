<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Departamento;
use App\User;

class AdminController extends Controller
{
    //
	public function index(){
		$depa=Departamento::with(['divisions'=>function($q){
			$q->with(['unidads'=>function($q){
				$q->with('actividades');
			}]);
		}])->get();
		foreach ($depa as $k=>$v){
			$depa[$k]->user=User::find($v->user_id);
		}
		return response()->json($depa);
	}
}
