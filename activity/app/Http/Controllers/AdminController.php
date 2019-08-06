<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Departamento;
use App\Division;
use App\User;
use App\Actividad;
use App\Mail\NotifyMail;
use App\SubActividad;
use App\Jerarquia;


class AdminController extends Controller
{
    //
	public function index(){
		$depa=Departamento::with(['divisions'=>function($q){
			$q->with(['unidads'=>function($q){
				$q->with(['actividades'=>function($q){
						$q->with(['subActividades','users']);
					}]);
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
	public function newActivityToUser(Request $request){
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
	public function updateActivity(Request $request){
		$act=Actividad::find($request->id);
		$act->descripcion=$request->descripcion;
		$act->fecha=$request->fecha;
		$act->hora=$request->hora;
		$act->update();
		return response()->json($act);
	}
	public function newSubActivity(Request $request)
	{
		$sub=new SubActividad();
		$sub->actividad_id=$request->actividad_id;
		$sub->subactividad=$request->subactividad;
		$sub->status='En Proceso';
		$sub->save();
		return response()->json($sub);
	}
	public function assignActivity(Request $request)
	{
		$user=User::find($request->user_id);
		$acti=Actividad::find($request->actividad_id);
        	$acti->users()->attach($user);
		/*\Mail::send('mail.text', ['actividad'=>$acti->actividad], function ($message) {
			$message->from('desarrollo@usupso.com.mx', 'Usupso Activity System');
			$message->subject('Usupso Activity');
			$message->to('er1k_92@hotmail.com');
		});*/
		return response()->json($request);
	}
	public function unAssignActivity(Request $request)
	{
		$user=User::find($request->user_id);
		$acti=Actividad::find($request->actividad_id);
        	$acti->users()->detach($user);
		return response()->json($request);
	}
	public function newActivity(Request $request)
	{
		$actividad=new Actividad();
		$actividad->unidad_id=$request->unidad_id;
		$actividad->actividad=$request->actividad;
		$actividad->status='En Proceso';
		$actividad->save();
		$actividad->users=[];
		return response()->json($actividad);
	}
	public function pushJerarquia(Request $request)
	{
		$actividad=Jerarquia::where('act_referencia',$request->actividad_id)->first();
		if(!$actividad){
			$jerarquia=new Jerarquia();
			$jerarquia->actividad_id=$request->actividad_id;
			$jerarquia->act_referencia=$request->actividad_id;
			$jerarquia->save();
		}
		$jerarquia=new Jerarquia();
		$jerarquia->actividad_id=$request->actividad_id;
		$jerarquia->act_referencia=$request->act_referencia;
		$jerarquia->save();
		return response()->json($request);
	}
	public function updateJerarquia(Request $request)
	{
		foreach ($request->actividades as $k=>$v) {
			$jerarqui=Jerarquia::where('actividad_id',$request->actividad_id)->where('act_referencia',$v['id'])->first();
			$jerarqui->fase=$k+1;
			$jerarqui->update();
		}
		return response()->json($request);
	}
	public function actividadJerarquia(Request $request)
	{
		$actividades=[];
		$je=Jerarquia::where('act_referencia',$request->act_referencia)->first();
		if($je){
		$jerarquia=Jerarquia::where('actividad_id',$je->actividad_id)->orderBy('fase')->get();
		foreach ($jerarquia as $jera){
			//$actividad=Actividad::with(['users','unidad'])->where('id', $jera->act_referencia)->first();
			$actos=Actividad::with(['users'])
				->select('actividads.*','unidads.unidad','divisions.division','departamentos.departamento')
				->join('unidads','actividads.unidad_id','unidads.id')
				->join('divisions','unidads.division_id','divisions.id')
				->join('departamentos','divisions.departamento_id','departamentos.id')
				->where('actividads.id', $jera->act_referencia)
				->first();
			array_push($actividades, $actos);
		}
		}
		return response()->json($actividades);
	}
}
