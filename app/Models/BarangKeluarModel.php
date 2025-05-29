<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarangKeluarModel extends Model
{
    protected $table = 'barang_keluar';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'nama_barang',
        'jumlah',
        'tanggal_keluar',
        'keterangan',
    ];

    public function barang()
    {
        return $this->belongsTo(BarangModel::class, 'barang_id');
    }
}
