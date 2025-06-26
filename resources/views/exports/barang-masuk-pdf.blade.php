{{-- filepath: /Users/muhammadnurfatkhurrahman/Developments/personal/item-stocks/resources/views/exports/barang-masuk-pdf.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Barang Masuk</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; margin-bottom: 20px; }
        .logo { width: 70px; height: 70px; margin: 0 auto 10px; display: block; }
        .company-name { font-size: 18px; font-weight: bold; }
        .company-address { font-size: 11px; color: #666; }
        .report-title { font-size: 15px; font-weight: bold; margin-top: 10px; }
        .report-period { font-size: 11px; color: #666; margin-top: 3px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; font-size: 11px; }
        th { background: #f8f9fa; }
        .footer { margin-top: 30px; font-size: 10px; text-align: right; }
        .signature { margin-top: 40px; text-align: center; }
        .signature-line { border-top: 1px solid #333; width: 200px; margin: 40px auto 5px; }
        .no-data { text-align: center; color: #666; padding: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('images/logo.png') }}" alt="Logo" class="logo">
        <div class="company-name">PANJANG RESTO & CAFE</div>
        <div class="company-address">Jl. Contoh Alamat No. 123, Kota, Provinsi 12345</div>
        <div class="company-address">Telp: (021) 123-4567 | Email: info@panjangresto.com</div>
        <div class="report-title">LAPORAN BARANG MASUK</div>
        <div class="report-period">
            Periode: {{ \Carbon\Carbon::parse($tanggalAwal)->format('d F Y') }} - {{ \Carbon\Carbon::parse($tanggalAkhir)->format('d F Y') }}
        </div>
    </div>
    @if($dataBarangMasuk->count())
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Bahan</th>
                    <th>Jumlah</th>
                    <th>Satuan</th>
                    <th>Tanggal Masuk</th>
                    <th>Keterangan</th>
                </tr>
            </thead>
            <tbody>
                @foreach($dataBarangMasuk as $i => $item)
                    <tr>
                        <td align="center">{{ $i + 1 }}</td>
                        <td>{{ $item->barang->nama_barang ?? '-' }}</td>
                        <td align="center">{{ $item->jumlah }}</td>
                        <td align="center">{{ $item->barang->satuan ?? '-' }}</td>
                        <td align="center">{{ \Carbon\Carbon::parse($item->tanggal_masuk)->format('d/m/Y') }}</td>
                        <td>{{ $item->keterangan }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        <div class="signature">
            <div>Mengetahui,</div>
            <div style="margin-top: 5px;">Manager</div>
            <div class="signature-line"></div>
            <div>(_______________________)</div>
        </div>
    @else
        <div class="no-data">
            <strong>Tidak ada data barang masuk untuk periode ini.</strong>
        </div>
    @endif
    <div class="footer">
        Dicetak: {{ \Carbon\Carbon::now()->format('d F Y H:i') }}
    </div>
</body>
</html>