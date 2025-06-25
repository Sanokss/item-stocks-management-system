<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\BarangModel;
use App\Models\BarangMasukModel;
use App\Models\BarangKeluarModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Total Bahan
        $totalBahan = BarangModel::count();

        // Bahan Masuk bulan ini
        $bahanMasukBulanIni = BarangMasukModel::whereMonth('tanggal_masuk', Carbon::now()->month)
            ->whereYear('tanggal_masuk', Carbon::now()->year)
            ->sum('jumlah');

        // Bahan Keluar bulan ini
        $bahanKeluarBulanIni = BarangKeluarModel::whereMonth('tanggal_keluar', Carbon::now()->month)
            ->whereYear('tanggal_keluar', Carbon::now()->year)
            ->sum('jumlah');

        // Stok Rendah (stok <= 10)
        $stokRendah = BarangModel::where('stok', '<=', 10)->count();

        // Data untuk chart trend 6 bulan terakhir
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthName = $date->format('M');

            $masuk = BarangMasukModel::whereMonth('tanggal_masuk', $date->month)
                ->whereYear('tanggal_masuk', $date->year)
                ->sum('jumlah');

            $keluar = BarangKeluarModel::whereMonth('tanggal_keluar', $date->month)
                ->whereYear('tanggal_keluar', $date->year)
                ->sum('jumlah');

            $monthlyData[] = [
                'name' => $monthName,
                'masuk' => $masuk ?: 0,
                'keluar' => $keluar ?: 0,
            ];
        }

        // Data untuk distribusi stok
        $stokTinggi = BarangModel::where('stok', '>', 50)->count();
        $stokSedang = BarangModel::where('stok', '>', 10)->where('stok', '<=', 50)->count();
        $stokRendahCount = BarangModel::where('stok', '<=', 10)->count();

        $stockData = [
            ['name' => 'Stok Tinggi', 'value' => $stokTinggi, 'color' => '#10B981'],
            ['name' => 'Stok Sedang', 'value' => $stokSedang, 'color' => '#F59E0B'],
            ['name' => 'Stok Rendah', 'value' => $stokRendahCount, 'color' => '#EF4444'],
        ];

        // Filter out zero values untuk chart
        $stockData = array_filter($stockData, function ($item) {
            return $item['value'] > 0;
        });

        // List bahan dengan stok rendah untuk notifikasi
        $bahanStokRendah = BarangModel::where('stok', '<=', 10)
            ->select('nama_barang', 'stok', 'satuan')
            ->orderBy('stok', 'asc')
            ->get();

        return Inertia::render('Owner/Dashboard', [
            'title' => 'Dashboard Owner',
            'description' => 'Dashboard untuk mengelola inventori',
            'stats' => [
                'totalBahan' => $totalBahan,
                'bahanMasukBulanIni' => $bahanMasukBulanIni,
                'bahanKeluarBulanIni' => $bahanKeluarBulanIni,
                'stokRendah' => $stokRendah,
            ],
            'monthlyData' => array_values($monthlyData),
            'stockData' => array_values($stockData),
            'bahanStokRendah' => $bahanStokRendah,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
