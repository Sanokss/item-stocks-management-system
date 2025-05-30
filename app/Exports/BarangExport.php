<?php

namespace App\Exports;

use App\Models\BarangModel;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;

class BarangExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
{
    protected $tanggalAwal;
    protected $tanggalAkhir;

    public function __construct($tanggalAwal, $tanggalAkhir)
    {
        $this->tanggalAwal = $tanggalAwal;
        $this->tanggalAkhir = $tanggalAkhir;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return BarangModel::whereBetween('created_at', [
            $this->tanggalAwal . ' 00:00:00',
            $this->tanggalAkhir . ' 23:59:59'
        ])->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Barang',
            'Stok',
            'Satuan',
            'Tanggal Dibuat',
            'Status Stok'
        ];
    }

    public function map($barang): array
    {
        static $no = 1;
        
        $statusStok = 'Tinggi';
        if ($barang->stok <= 10) {
            $statusStok = 'Rendah';
        } elseif ($barang->stok <= 50) {
            $statusStok = 'Sedang';
        }

        return [
            $no++,
            $barang->nama_barang,
            $barang->stok,
            strtoupper($barang->satuan),
            Carbon::parse($barang->created_at)->format('d/m/Y'),
            $statusStok
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 5,
            'B' => 25,
            'C' => 10,
            'D' => 10,
            'E' => 15,
            'F' => 15,
        ];
    }
}
