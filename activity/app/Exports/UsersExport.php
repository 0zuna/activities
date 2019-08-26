<?php

namespace App\Exports;

use App\Actividad;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class UsersExport implements FromCollection, WithHeadings, ShouldAutoSize, WithMultipleSheets
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function __construct($actividades,$res)
    {
        $this->actos = $actividades;
        $this->res = $res;
    }
    public function collection()
    {
	return $this->actos;
	
    }
    public function headings(): array
    {
        return [
            'Nombre',
	    'Apellido Paterno',
	    'Apellido Materno',
	    'cuando se asigno',
	    'actividad',
	    'realizada',
	    'tipo',
	    'fechaEntrega',
	    'horaEntrega',
	    'fechaSolicitada',
	    'horaSolicitada',
	    'productividad'
        ];
    }
    public function sheets(): array
    {
        $sheets = [];

        //for ($month = 1; $month <= 12; $month++) {
            $sheets[] = new ActividadExport($this->actos);
            $sheets[] = new Resumen($this->res);

        //}

        return $sheets;
    }
}
