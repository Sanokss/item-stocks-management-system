<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\BarangKeluarModel;
use App\Models\BarangModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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
            'title' => 'Barang Keluar',
            'description' => 'Halaman untuk mengelola barang keluar',
            'dataBarangKeluar' => $barangKeluar,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Owner/BarangKeluar/Create', [
            'title' => 'Tambah Barang Keluar',
            'description' => 'Halaman untuk menambah barang keluar baru',
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

        DB::transaction(function () use ($request) {
            // Find the barang
            $barang = BarangModel::findOrFail($request->barang_id);

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

        return redirect()->route('owner.barang-keluar.index')->with('success', 'Barang keluar berhasil ditambahkan dan stok telah diperbarui.');
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
