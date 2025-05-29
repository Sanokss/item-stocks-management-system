<?php

namespace Database\Seeders;

use App\Models\BarangKeluarModel;
use Illuminate\Database\Seeder;

class BarangKeluarSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        BarangKeluarModel::create([
            'barang_id' => 1,
            'jumlah' => 10,
            'tanggal_keluar' => now(),
            'keterangan' => 'Barang keluar pertama',
        ]);
    }
}
