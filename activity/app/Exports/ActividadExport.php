<?php

namespace App\Exports;

use App\Actividad;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;

class ActividadExport implements FromCollection, WithHeadings, ShouldAutoSize, WithTitle
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function __construct($actividades)
    {
        $this->actos = $actividades;
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
    /*public function sheets(): array
    {
        $sheets = [];

        //for ($month = 1; $month <= 12; $month++) {
            $sheets[] = new Resumen();
            $sheets[] = new Resumen();

        //}

        return $sheets;
    }*/
    public function title(): string
    {
        return 'actividades';
    }
}
