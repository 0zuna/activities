<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Actividad;
use App\Unidad;
use App\Departamento;
use App\Division;

class ExcelController extends Controller
{
    //
	public function index(Request $request){
		if($request->excel!=''){
			file_put_contents(storage_path()."/hi2.xlsx", base64_decode(explode(',',$request->excel)[1]));
			$Reader = new \SpreadsheetReader(storage_path()."/hi2.xlsx");
			foreach ($Reader as $k=>$v){
				if($k<1)continue;
				$depa=Departamento::where('departamento',$v[0])->first();
				if(!$depa){
					$depa=new Departamento();
					$depa->departamento=$v[0];
					$depa->save();
				}
				$div=Division::where('division',$v[1])->where('departamento_id',$depa->id)->first();
				if(!$div){
					$div=new Division();
					$div->division=$v[1];
					$div->departamento_id=$depa->id;
					$div->save();
				}
				$unni=Unidad::where('unidad',$v[2])->where('division_id',$div->id)->first();
				if(!$unni){
					$unni=new Unidad();
					$unni->unidad=$v[2];
					$unni->division_id=$div->id;
					$unni->save();
				}

				$acti=new Actividad();
				$acti->actividad=$v[3];
				$acti->unidad_id=$unni->id;
				if($v[4]=='R')
					$acti->reporte=1;
				$acti->save();
			}
		}
		$depa=Departamento::with(['divisions'=>function($q){
			$q->with(['unidads'=>function($q){
				$q->with('actividades');
			}]);
		}])->get();
		return response()->json($depa);
	}
}
