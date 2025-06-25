<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BarangExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        return $this->data;
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Bahan',
            'Stok',
            'Satuan',
            'Status Stok',
            'Tanggal Dibuat',
        ];
    }

    public function map($barang): array
    {
        static $no = 1;

        // Determine stock status
        $statusStok = '';
        if ($barang->stok <= 10) {
            $statusStok = 'Stok Rendah';
        } elseif ($barang->stok <= 50) {
            $statusStok = 'Stok Sedang';
        } else {
            $statusStok = 'Stok Tinggi';
        }

        return [
            $no++,
            $barang->nama_barang,
            $barang->stok,
            $barang->satuan,
            $statusStok,
            date('d/m/Y H:i', strtotime($barang->created_at)),
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
            'A:F' => [
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
            'C' => 10,  // Stok
            'D' => 12,  // Satuan
            'E' => 15,  // Status Stok
            'F' => 20,  // Tanggal Dibuat
        ];
    }
}
