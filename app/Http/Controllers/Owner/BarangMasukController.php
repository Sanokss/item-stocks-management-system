<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\BarangMasukModel;
use App\Models\BarangModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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
            'title' => 'Barang Masuk',
            'description' => 'Halaman untuk mengelola barang masuk',
            'dataBarangMasuk' => $barangMasuk,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Owner/BarangMasuk/Create', [
            'title' => 'Tambah Barang Masuk',
            'description' => 'Halaman untuk menambah barang masuk baru',
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

        return redirect()->route('owner.barang-masuk.index')->with('success', 'Barang masuk berhasil ditambahkan dan stok telah diperbarui.');
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

    public function cetak()
    {
        return Inertia::render('Owner/BarangMasuk/Cetak/Index', [
            'title' => 'Cetak Barang Masuk',
            'description' => 'Halaman untuk mencetak data barang masuk',

        ]);
    }
}
