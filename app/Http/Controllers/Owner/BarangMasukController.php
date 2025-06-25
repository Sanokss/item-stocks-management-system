<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\BarangMasukModel;
use App\Models\BarangModel;
use App\Exports\BarangMasukExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class BarangMasukController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $barangMasuk = BarangMasukModel::with(['barang'])
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('Owner/BarangMasuk/Index', [
            'title' => 'Bahan Masuk',
            'description' => 'Halaman untuk mengelola bahan masuk',
            'dataBarangMasuk' => $barangMasuk,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Owner/BarangMasuk/Create', [
            'title' => 'Tambah Bahan Masuk',
            'description' => 'Halaman untuk menambah bahan masuk baru',
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
            'tanggal_masuk' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ]);

        try {
            DB::transaction(function () use ($request) {
                // Find the barang
                $barang = BarangModel::findOrFail($request->barang_id);

                // Create barang masuk record
                BarangMasukModel::create([
                    'barang_id' => $request->barang_id,
                    'jumlah' => $request->jumlah,
                    'tanggal_masuk' => $request->tanggal_masuk,
                    'keterangan' => $request->keterangan != null ? $request->keterangan : '-',
                ]);

                // Update stock in BarangModel
                $barang->increment('stok', $request->jumlah);
            });

            // Return back (tidak redirect)
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
        $barangMasuk = BarangMasukModel::with(['barang'])->findOrFail($id);
        return Inertia::render('Owner/BarangMasuk/Edit', [
            'title' => 'Edit Bahan Masuk',
            'description' => 'Halaman untuk mengedit bahan masuk',
            'dataBarangMasuk' => $barangMasuk,
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
            'tanggal_masuk' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ]);

        try {
            DB::transaction(function () use ($request, $id) {
                // Find the barang masuk
                $barangMasuk = BarangMasukModel::findOrFail($id);

                // Simpan nilai asli SEBELUM di-update
                $jumlahLama = $barangMasuk->jumlah;
                $barangIdLama = $barangMasuk->barang_id;

                // Find the barang lama dan baru
                $barangLama = BarangModel::findOrFail($barangIdLama);
                $barangBaru = BarangModel::findOrFail($request->barang_id);

                // Update barang masuk record
                $barangMasuk->update([
                    'barang_id' => $request->barang_id,
                    'jumlah' => $request->jumlah,
                    'tanggal_masuk' => $request->tanggal_masuk,
                    'keterangan' => $request->keterangan != null ? $request->keterangan : '-',
                ]);

                // Jika barang berubah
                if ($barangIdLama != $request->barang_id) {
                    // Kurangi stok dari barang lama
                    $barangLama->decrement('stok', $jumlahLama);
                    // Tambah stok ke barang baru
                    $barangBaru->increment('stok', $request->jumlah);
                } else {
                    // Jika barang sama, hitung selisih jumlah
                    $selisih = $request->jumlah - $jumlahLama;
                    if ($selisih != 0) {
                        $barangBaru->increment('stok', $selisih);
                    }
                }
            });

            // Return back (tidak redirect)
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
            DB::transaction(function () use ($id) {
                // Find the barang masuk
                $barangMasuk = BarangMasukModel::findOrFail($id);

                // Find the related barang
                $barang = BarangModel::findOrFail($barangMasuk->barang_id);

                // Check if there's enough stock to deduct
                if ($barang->stok < $barangMasuk->jumlah) {
                    throw new \Exception('Tidak dapat menghapus data karena stok bahan tidak mencukupi untuk dikurangi.');
                }

                // Decrease stock in BarangModel
                $barang->decrement('stok', $barangMasuk->jumlah);

                // Delete the barang masuk record
                $barangMasuk->delete();
            });

            return redirect()->route('owner.barang-masuk.index')->with('success', 'Data bahan masuk berhasil dihapus dan stok telah diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Gagal menghapus data bahan masuk: ' . $e->getMessage()
            ]);
        }
    }

    public function cetak()
    {
        return Inertia::render('Owner/BarangMasuk/Cetak/Index', [
            'title' => 'Cetak Bahan Masuk',
            'description' => 'Halaman untuk mencetak data bahan masuk',
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
        $fileName = 'Laporan_Bahan_Masuk_' .
            date('d-m-Y', strtotime($tanggalAwal)) . '_sampai_' .
            date('d-m-Y', strtotime($tanggalAkhir)) . '.xlsx';

        return Excel::download(new BarangMasukExport($tanggalAwal, $tanggalAkhir), $fileName);
    }
}
