<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Departamento;
use App\Division;
use App\User;
use App\Actividad;
use App\Mail\NotifyMail;


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
			foreach ($v->divisions as $i=>$vv) {
			$depa[$k]->divisions[$i]->user=User::find($vv->user_id);
			}
		}
		return response()->json($depa);
	}
	public function users(){
		return response()->json(User::all());
	}
	public function jefe_dep(Request $request){
		$dep=Departamento::find($request->departamento_id);
		$dep->user_id=$request->user_id;
		$dep->update();
	}
	public function jefe_div(Request $request){
		$div=Division::find($request->division_id);
		$div->user_id=$request->user_id;
		$div->update();
	}
	public function actividad_user(Request $request){
		$actividades=User::find($request->user_id)->actividades()->get();
		return response()->json($actividades);
	}
	public function newActivity(Request $request){
        	$user = User::find($request->user_id);
		$actividad=new Actividad();
		$actividad->actividad=$request->actividad;
		$actividad->save();
        	$actividad->users()->attach($user);
		\Mail::send('mail.text', ['actividad'=>$actividad->actividad], function ($message) {
			$message->from('desarrollo@usupso.com.mx', 'desarrollo');
			$message->subject('Nueva Actividad');
			$message->to('er1k_92@hotmail.com');
		});
		return response()->json($actividad);
	}
}
