<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\BarangModel;
use App\Exports\BarangExport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class BarangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $barang = BarangModel::all();
        return inertia('Owner/DaftarBarang/Index', [
            'title' => 'Barang',
            'description' => 'Halaman untuk mengelola barang',
            'dataBarang' => $barang->values()->toArray(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Owner/DaftarBarang/Create', [
            'title' => 'Tambah Barang',
            'description' => 'Halaman untuk menambah barang baru',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_barang' => 'required|string|max:255',
            'stok' => 'required|integer|min:0',
            'satuan' => 'required|string|max:50',
        ]);

        try {
            BarangModel::create([
                'nama_barang' => $request->nama_barang,
                'stok' => $request->stok,
                'satuan' => $request->satuan,
            ]);

            // Return back to create page (tidak redirect)
            return back();
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Gagal menyimpan data: ' . $e->getMessage()]);
        }
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
        return Inertia::render('Owner/DaftarBarang/Edit', [
            'title' => 'Edit Barang',
            'description' => 'Halaman untuk mengedit barang',
            'dataBarang' => BarangModel::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nama_barang' => 'required|string|max:255',
            'satuan' => 'required|string|max:50',
        ]);

        try {
            $barang = BarangModel::findOrFail($id);

            $barang->update([
                'nama_barang' => $request->nama_barang,
                'satuan' => $request->satuan,
            ]);

            // Return back (tidak redirect, biar toast muncul dulu)
            return back();
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Gagal memperbarui data: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $barang = BarangModel::findOrFail($id);

            // Check if barang is used in barang_masuk or barang_keluar
            $isUsedInBarangMasuk = \App\Models\BarangMasukModel::where('barang_id', $id)->exists();
            $isUsedInBarangKeluar = \App\Models\BarangKeluarModel::where('barang_id', $id)->exists();

            if ($isUsedInBarangMasuk || $isUsedInBarangKeluar) {
                return back()->withErrors([
                    'error' => 'Tidak dapat menghapus bahan karena masih digunakan dalam transaksi barang masuk atau keluar.'
                ]);
            }

            $barang->delete();

            return redirect()->route('owner.barang.index')->with('success', 'Bahan berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Gagal menghapus bahan: ' . $e->getMessage()
            ]);
        }
    }

    public function cetak()
    {
        $barang = BarangModel::all();
        return Inertia::render('Owner/DaftarBarang/Cetak/Index', [
            'title' => 'Cetak Daftar Barang',
            'description' => 'Halaman untuk mencetak daftar barang',
            'dataBarang' => $barang->values()->toArray(),
        ]);
    }

    public function exportExcel(Request $request)
    {
        $request->validate([
            'tanggal_awal' => 'required|date',
            'tanggal_akhir' => 'required|date|after_or_equal:tanggal_awal',
        ]);

        $tanggalAwal = $request->tanggal_awal;
        $tanggalAkhir = $request->tanggal_akhir;

        // Filter data berdasarkan tanggal created_at
        $dataBarang = BarangModel::whereBetween('created_at', [
            $tanggalAwal . ' 00:00:00',
            $tanggalAkhir . ' 23:59:59'
        ])->get();

        // Format nama file dengan tanggal
        $fileName = 'Laporan_Daftar_Bahan_' .
            date('d-m-Y', strtotime($tanggalAwal)) . '_sampai_' .
            date('d-m-Y', strtotime($tanggalAkhir)) . '.xlsx';

        return Excel::download(new BarangExport($dataBarang), $fileName);
    }

    /**
     * Check low stock items.
     */
    public function checkLowStock()
    {
        $minimumStock = 10; // Batas minimum stok

        $lowStockItems = BarangModel::where('stok', '<=', $minimumStock)
            ->select('id', 'nama_barang', 'stok', 'satuan')
            ->get()
            ->map(function ($item) use ($minimumStock) {
                return [
                    'id' => $item->id,
                    'nama_barang' => $item->nama_barang,
                    'stok' => $item->stok,
                    'satuan' => $item->satuan,
                    'minimum_stok' => $minimumStock
                ];
            });

        return response()->json([
            'lowStockItems' => $lowStockItems
        ]);
    }

    public function exportPdf(Request $request)
    {
        $request->validate([
            'tanggal_awal' => 'required|date',
            'tanggal_akhir' => 'required|date|after_or_equal:tanggal_awal',
        ]);

        $tanggalAwal = $request->tanggal_awal;
        $tanggalAkhir = $request->tanggal_akhir;

        // Filter data berdasarkan tanggal created_at
        $dataBarang = BarangModel::whereBetween('created_at', [
            $tanggalAwal . ' 00:00:00',
            $tanggalAkhir . ' 23:59:59'
        ])->orderBy('nama_barang', 'asc')->get();

        // Format nama file dengan tanggal
        $fileName = 'Laporan_Daftar_Bahan_' .
            date('d-m-Y', strtotime($tanggalAwal)) . '_sampai_' .
            date('d-m-Y', strtotime($tanggalAkhir)) . '.pdf';

        // Generate PDF
        $pdf = Pdf::loadView('exports.barang-pdf', [
            'dataBarang' => $dataBarang,
            'tanggalAwal' => $tanggalAwal,
            'tanggalAkhir' => $tanggalAkhir,
        ]);

        // Set paper size and orientation
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download($fileName);
    }
}
