<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarangMasukModel extends Model
{
    protected $table = 'barang_masuk';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'nama_barang',
        'jumlah',
        'tanggal_masuk',
        'keterangan',
    ];

    public function barang()
    {
        return $this->belongsTo(BarangModel::class, 'barang_id');
    }
}
