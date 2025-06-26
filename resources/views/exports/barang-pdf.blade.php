<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Daftar Bahan</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 12px;
            line-height: 1.4;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 15px;
            display: block;
        }
        
        .company-info {
            margin-bottom: 15px;
        }
        
        .company-name {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        
        .company-address {
            font-size: 11px;
            color: #666;
            margin-bottom: 3px;
        }
        
        .report-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-top: 15px;
        }
        
        .report-period {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
        }
        
        .content {
            margin-top: 20px;
        }
        
        .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
        }
        
        .info-item {
            font-size: 11px;
        }
        
        .info-label {
            font-weight: bold;
            color: #333;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        th {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 8px;
            text-align: center;
            font-weight: bold;
            font-size: 11px;
        }
        
        td {
            border: 1px solid #dee2e6;
            padding: 6px 8px;
            font-size: 10px;
        }
        
        .text-center {
            text-align: center;
        }
        
        .text-right {
            text-align: right;
        }
        
        .status-rendah {
            background-color: #fee;
            color: #c53030;
            font-weight: bold;
        }
        
        .status-sedang {
            background-color: #fffaf0;
            color: #d69e2e;
            font-weight: bold;
        }
        
        .status-tinggi {
            background-color: #f0fff4;
            color: #38a169;
            font-weight: bold;
        }
        
        .footer {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
        }
        
        .signature {
            text-align: center;
            margin-top: 40px;
        }
        
        .signature-line {
            border-top: 1px solid #333;
            width: 200px;
            margin: 50px auto 5px;
        }
        
        .no-data {
            text-align: center;
            padding: 40px;
            color: #666;
            font-style: italic;
        }
        
        .summary {
            background-color: #f8f9fa;
            padding: 15px;
            margin-top: 20px;
            border-radius: 5px;
            border-left: 4px solid #007bff;
        }
        
        .summary-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
        }
        
        .summary-item {
            text-align: center;
        }
        
        .summary-number {
            font-size: 16px;
            font-weight: bold;
            color: #007bff;
        }
        
        .summary-label {
            font-size: 10px;
            color: #666;
            margin-top: 3px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <!-- Logo -->
        <img src="{{ public_path('images/logo.png') }}" alt="Logo Panjang Resto & Cafe" class="logo">
        
        <div class="company-info">
            <div class="company-name">PANJANG RESTO & CAFE</div>
            <div class="company-address">Jl. Engku Putri, Tj. Ayun Sakti, Kec. Bukit Bestari, Kota Tanjung Pinang, Kepulauan Riau</div>
        </div>
        
        <div class="report-title">LAPORAN DAFTAR BAHAN</div>
        <div class="report-period">
            Periode: {{ \Carbon\Carbon::parse($tanggalAwal)->format('d F Y') }} - {{ \Carbon\Carbon::parse($tanggalAkhir)->format('d F Y') }}
        </div>
    </div>

    <!-- Content -->
    <div class="content">
        <!-- Info Section -->
        <div class="info-section">
            <div class="info-item">
                <div class="info-label">Tanggal Cetak:</div>
                <div>{{ \Carbon\Carbon::now()->format('d F Y H:i') }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Total Bahan:</div>
                <div>{{ $dataBarang->count() }} item</div>
            </div>
            <div class="info-item">
                <div class="info-label">Dicetak Oleh:</div>
                <div>{{ auth()->user()->name ?? 'System' }}</div>
            </div>
        </div>

        @if($dataBarang->count() > 0)
            <!-- Summary -->
            <div class="summary">
                <div class="summary-title">Ringkasan Stok</div>
                <div class="summary-grid">
                    <div class="summary-item">
                        <div class="summary-number">{{ $dataBarang->where('stok', '<=', 10)->count() }}</div>
                        <div class="summary-label">Stok Rendah (≤10)</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-number">{{ $dataBarang->whereBetween('stok', [11, 50])->count() }}</div>
                        <div class="summary-label">Stok Sedang (11-50)</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-number">{{ $dataBarang->where('stok', '>', 50)->count() }}</div>
                        <div class="summary-label">Stok Tinggi (>50)</div>
                    </div>
                </div>
            </div>

            <!-- Table -->
            <table>
                <thead>
                    <tr>
                        <th width="5%">No</th>
                        <th width="30%">Nama Bahan</th>
                        <th width="10%">Stok</th>
                        <th width="12%">Satuan</th>
                        <th width="15%">Status Stok</th>
                        <th width="18%">Tanggal Dibuat</th>
                        <th width="10%">Nilai Stok</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($dataBarang as $index => $barang)
                        @php
                            if ($barang->stok <= 10) {
                                $statusClass = 'status-rendah';
                                $statusText = 'Stok Rendah';
                            } elseif ($barang->stok <= 50) {
                                $statusClass = 'status-sedang';
                                $statusText = 'Stok Sedang';
                            } else {
                                $statusClass = 'status-tinggi';
                                $statusText = 'Stok Tinggi';
                            }
                        @endphp
                        <tr>
                            <td class="text-center">{{ $index + 1 }}</td>
                            <td>{{ $barang->nama_barang }}</td>
                            <td class="text-center">{{ number_format($barang->stok) }}</td>
                            <td class="text-center">{{ $barang->satuan }}</td>
                            <td class="text-center {{ $statusClass }}">{{ $statusText }}</td>
                            <td class="text-center">{{ \Carbon\Carbon::parse($barang->created_at)->format('d/m/Y H:i') }}</td>
                            <td class="text-center">{{ number_format($barang->stok) }} {{ $barang->satuan }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <!-- Signature -->
            <div class="signature">
                <div style="margin-top: 40px;">
                    <div>Mengetahui,</div>
                    <div style="margin-top: 5px;">Pemilik</div>
                    <div class="signature-line"></div>
                    <div>(ARIFIN)</div>
                </div>
            </div>
        @else
            <div class="no-data">
                <strong>Tidak ada data bahan yang ditemukan untuk periode yang dipilih.</strong>
                <br>
                <small>Periode: {{ \Carbon\Carbon::parse($tanggalAwal)->format('d F Y') }} - {{ \Carbon\Carbon::parse($tanggalAkhir)->format('d F Y') }}</small>
            </div>
        @endif
    </div>

    <!-- Footer -->
    <div class="footer">
        <div>Laporan ini dibuat secara otomatis oleh sistem</div>
        <div>Halaman 1 dari 1</div>
    </div>
</body>
</html>