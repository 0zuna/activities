<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use App\User;

class Resumen implements FromCollection, ShouldAutoSize, WithHeadings, WithTitle
{

    public function __construct($actos)
    {
	    $this->actos=$actos;
    }

    /**
     * @return Builder
     */
    public function collection()
    {
        return $this->actos;
    }
    public function headings(): array
    {
        return [
            'total de actividades',
	    'total de realizadas',
	    'total de no realizadas',
	    'productividad'
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'resumen';
    }
}

