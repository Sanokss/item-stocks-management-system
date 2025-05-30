<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\BarangModel;
use App\Exports\BarangExport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

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
            'satuan' => 'required|string|max:255',
            'stok' => 'required|integer|min:0',
        ]);

        BarangModel::create([
            'nama_barang' => $request->nama_barang,
            'satuan' => $request->satuan,
            'stok' => $request->stok,
        ]);

        return redirect()->route('owner.barang.index')->with('success', 'Barang berhasil ditambahkan.');
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
            'satuan' => 'required|string|max:255',
        ]);

        $barang = BarangModel::findOrFail($id);
        $barang->update([
            'nama_barang' => $request->nama_barang,
            'satuan' => $request->satuan,
        ]);

        return redirect()->route('owner.barang.index')->with('success', 'Barang berhasil diperbarui.');
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

        $filename = 'laporan-daftar-barang-' . date('Y-m-d-H-i-s') . '.xlsx';

        return Excel::download(new BarangExport($tanggalAwal, $tanggalAkhir), $filename);
    }
}
