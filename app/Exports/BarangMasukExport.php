<?php

namespace App\Exports;

use App\Models\BarangMasukModel;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;

class BarangMasukExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
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
        return BarangMasukModel::with(['barang'])
            ->whereBetween('tanggal_masuk', [
                $this->tanggalAwal,
                $this->tanggalAkhir
            ])
            ->orderBy('tanggal_masuk', 'desc')
            ->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Bahan',
            'Jumlah Masuk',
            'Satuan',
            'Tanggal Masuk',
            'Keterangan',
            'Tanggal Input'
        ];
    }

    public function map($barangMasuk): array
    {
        static $no = 1;

        return [
            $no++,
            $barangMasuk->barang->nama_barang ?? 'N/A',
            $barangMasuk->jumlah,
            strtoupper($barangMasuk->barang->satuan ?? 'N/A'),
            Carbon::parse($barangMasuk->tanggal_masuk)->format('d/m/Y'),
            $barangMasuk->keterangan ?? '-',
            Carbon::parse($barangMasuk->created_at)->format('d/m/Y H:i')
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the header row
            1 => [
                'font' => [
                    'bold' => true,
                    'size' => 12,
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => [
                        'rgb' => 'E2E8F0',
                    ],
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    ],
                ],
            ],
            // Style all data rows
            'A:G' => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    ],
                ],
                'alignment' => [
                    'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                ],
            ],
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 5,   // No
            'B' => 25,  // Nama Bahan
            'C' => 15,  // Jumlah Masuk
            'D' => 10,  // Satuan
            'E' => 15,  // Tanggal Masuk
            'F' => 20,  // Keterangan
            'G' => 18,  // Tanggal Input
        ];
    }
}
