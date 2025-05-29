<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarangModel extends Model
{
    protected $table = 'barang';
    protected $fillable = ['nama_barang', 'stok', 'satuan'];

    public function barangMasuk()
    {
        return $this->hasMany(BarangMasukModel::class, 'barang_id');
    }

    public function barangKeluar()
    {
        return $this->hasMany(BarangKeluarModel::class, 'barang_id');
    }
}
