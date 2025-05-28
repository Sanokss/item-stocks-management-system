<?php

namespace Database\Seeders;

use App\Models\BarangMasukModel;
use Illuminate\Database\Seeder;

class BarangMasukSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        BarangMasukModel::create([
            'nama_barang' => 'Minyak Angin',
            'jumlah' => 10,
            'tanggal_masuk' => now(),
            'keterangan' => 'Barang masuk pertama',
        ]);
    }
}
