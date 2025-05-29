<?php

namespace Database\Seeders;

use App\Models\BarangModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BarangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BarangModel::create([
            'nama_barang' => 'Ayam Goreng',
            'stok' => 100,
            'satuan' => 'kg',
        ]);
    }
}
