<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\BarangKeluarModel;
use App\Models\BarangModel;
use App\Exports\BarangKeluarExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class BarangKeluarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $barangKeluar = BarangKeluarModel::with(['barang'])
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('Owner/BarangKeluar/Index', [
            'title' => 'Bahan Keluar',
            'description' => 'Halaman untuk mengelola bahan keluar',
            'dataBarangKeluar' => $barangKeluar,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Owner/BarangKeluar/Create', [
            'title' => 'Tambah Bahan Keluar',
            'description' => 'Halaman untuk menambah bahan keluar baru',
            'dataBarang' => BarangModel::all()->values()->toArray(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'barang_id' => 'required|exists:barang,id',
            'jumlah' => 'required|integer|min:1',
            'tanggal_keluar' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ]);

        try {
            DB::transaction(function () use ($request) {
                // Find the barang
                $barang = BarangModel::findOrFail($request->barang_id);

                // Check if there's enough stock
                if ($barang->stok < $request->jumlah) {
                    throw new \Exception('Stok bahan tidak mencukupi. Stok tersedia: ' . $barang->stok);
                }

                // Create barang keluar record
                BarangKeluarModel::create([
                    'barang_id' => $request->barang_id,
                    'jumlah' => $request->jumlah,
                    'tanggal_keluar' => $request->tanggal_keluar,
                    'keterangan' => $request->keterangan != null ? $request->keterangan : '-',
                ]);

                // Update stock in BarangModel
                $barang->decrement('stok', $request->jumlah);
            });

            // Return back (tidak redirect)
            return back();
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => $e->getMessage()]);
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
        $barangKeluar = BarangKeluarModel::with(['barang'])->findOrFail($id);
        return Inertia::render('Owner/BarangKeluar/Edit', [
            'title' => 'Edit Bahan Keluar',
            'description' => 'Halaman untuk mengedit bahan keluar',
            'dataBarangKeluar' => $barangKeluar,
            'dataBarang' => BarangModel::all()->values()->toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'barang_id' => 'required|exists:barang,id',
            'jumlah' => 'required|integer|min:1',
            'tanggal_keluar' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ]);

        try {
            DB::transaction(function () use ($request, $id) {
                // Find the barang keluar
                $barangKeluar = BarangKeluarModel::findOrFail($id);

                // Simpan nilai asli SEBELUM di-update
                $jumlahLama = $barangKeluar->jumlah;
                $barangIdLama = $barangKeluar->barang_id;

                // Find the barang lama dan baru
                $barangLama = BarangModel::findOrFail($barangIdLama);
                $barangBaru = BarangModel::findOrFail($request->barang_id);

                // Jika barang berubah
                if ($barangIdLama != $request->barang_id) {
                    // Tambah stok ke barang lama (kembalikan stok)
                    $barangLama->increment('stok', $jumlahLama);

                    // Check if new barang has enough stock
                    if ($barangBaru->stok < $request->jumlah) {
                        throw new \Exception('Stok bahan tidak mencukupi. Stok tersedia: ' . $barangBaru->stok);
                    }

                    // Kurangi stok dari barang baru
                    $barangBaru->decrement('stok', $request->jumlah);
                } else {
                    // Jika barang sama, hitung selisih jumlah
                    $selisih = $request->jumlah - $jumlahLama;
                    if ($selisih > 0) {
                        // Jika jumlah bertambah, cek apakah stok mencukupi
                        if ($barangBaru->stok < $selisih) {
                            throw new \Exception('Stok bahan tidak mencukupi. Stok tersedia: ' . $barangBaru->stok);
                        }
                    }
                    // Update stok (bisa positif atau negatif)
                    $barangBaru->decrement('stok', $selisih);
                }

                // Update barang keluar record
                $barangKeluar->update([
                    'barang_id' => $request->barang_id,
                    'jumlah' => $request->jumlah,
                    'tanggal_keluar' => $request->tanggal_keluar,
                    'keterangan' => $request->keterangan != null ? $request->keterangan : '-',
                ]);
            });

            // Return back (tidak redirect)
            return back();
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            DB::transaction(function () use ($id) {
                // Find the barang keluar
                $barangKeluar = BarangKeluarModel::findOrFail($id);

                // Find the related barang
                $barang = BarangModel::findOrFail($barangKeluar->barang_id);

                // Increase stock in BarangModel (kembalikan stok)
                $barang->increment('stok', $barangKeluar->jumlah);

                // Delete the barang keluar record
                $barangKeluar->delete();
            });

            return redirect()->route('owner.barang-keluar.index')->with('success', 'Data bahan keluar berhasil dihapus dan stok telah dikembalikan.');
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Gagal menghapus data bahan keluar: ' . $e->getMessage()
            ]);
        }
    }

    public function cetak()
    {
        return Inertia::render('Owner/BarangKeluar/Cetak/Index', [
            'title' => 'Cetak Bahan Keluar',
            'description' => 'Halaman untuk mencetak data bahan keluar',
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

        // Format nama file dengan konteks bahan
        $fileName = 'Laporan_Bahan_Keluar_' .
            date('d-m-Y', strtotime($tanggalAwal)) . '_sampai_' .
            date('d-m-Y', strtotime($tanggalAkhir)) . '.xlsx';

        return Excel::download(new BarangKeluarExport($tanggalAwal, $tanggalAkhir), $fileName);
    }
}
