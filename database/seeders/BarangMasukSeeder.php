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
            'barang_id' => 1,
            'jumlah' => 20,
            'tanggal_masuk' => now(),
            'keterangan' => 'Barang masuk pertama',
        ]);
    }
}
