<?php

namespace App\Exports;

use App\Models\BarangKeluarModel;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;

class BarangKeluarExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
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
        return BarangKeluarModel::with(['barang'])
            ->whereBetween('tanggal_keluar', [
                $this->tanggalAwal,
                $this->tanggalAkhir
            ])
            ->orderBy('tanggal_keluar', 'desc')
            ->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Barang',
            'Jumlah Keluar',
            'Satuan',
            'Tanggal Keluar',
            'Keterangan',
            'Tanggal Input'
        ];
    }

    public function map($barangKeluar): array
    {
        static $no = 1;

        return [
            $no++,
            $barangKeluar->barang->nama_barang ?? 'N/A',
            $barangKeluar->jumlah,
            strtoupper($barangKeluar->barang->satuan ?? 'N/A'),
            Carbon::parse($barangKeluar->tanggal_keluar)->format('d/m/Y'),
            $barangKeluar->keterangan ?? '-',
            Carbon::parse($barangKeluar->created_at)->format('d/m/Y H:i')
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
            'C' => 15,
            'D' => 10,
            'E' => 15,
            'F' => 20,
            'G' => 18,
        ];
    }
}
