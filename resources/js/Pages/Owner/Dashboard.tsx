import OwnerLayout from '@/Layouts/OwnerLayout';
import { Link } from '@inertiajs/react';
import {
    FaBox,
    FaExclamationTriangle,
    FaTruck,
    FaWarehouse,
} from 'react-icons/fa';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface Stats {
    totalBahan: number;
    bahanMasukBulanIni: number;
    bahanKeluarBulanIni: number;
    stokRendah: number;
}

interface MonthlyData {
    name: string;
    masuk: number;
    keluar: number;
}

interface StockData {
    name: string;
    value: number;
    color: string;
}

interface BahanStokRendah {
    nama_barang: string;
    stok: number;
    satuan: string;
}

interface DashboardProps {
    stats: Stats;
    monthlyData: MonthlyData[];
    stockData: StockData[];
    bahanStokRendah: BahanStokRendah[];
}

export default function Dashboard({
    stats,
    monthlyData,
    stockData,
    bahanStokRendah,
}: DashboardProps) {
    return (
        <OwnerLayout>
            <div className="container mx-auto p-6">
                {/* Welcome Section */}
                <div className="mb-8 rounded-xl bg-gray-50 p-8 shadow-lg dark:bg-gray-800">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                        <div className="mb-4 md:mb-0 md:mr-6">
                            <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 p-4 dark:bg-blue-900/30 md:mx-0">
                                <FaBox className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                Selamat Datang di Dashboard Inventori
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Kelola inventori Anda dengan mudah. Pantau stok
                                bahan, track bahan masuk dan keluar, serta
                                dapatkan notifikasi ketika stok rendah.
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <Link
                                href={route('owner.barang.cetak')}
                                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                            >
                                Lihat Laporan
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Alert untuk Stok Rendah */}
                {bahanStokRendah.length > 0 && (
                    <div className="mb-6 rounded-xl bg-red-50 p-6 shadow-lg dark:bg-red-900/20">
                        <div className="flex items-start">
                            <FaExclamationTriangle className="mr-3 mt-1 h-5 w-5 text-red-600 dark:text-red-400" />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                                    Peringatan: Stok Rendah!
                                </h3>
                                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                                    {bahanStokRendah.length} bahan memiliki stok
                                    rendah (≤ 10):
                                </p>
                                <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                                    {bahanStokRendah
                                        .slice(0, 6)
                                        .map((bahan, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-lg bg-red-100 px-3 py-2 dark:bg-red-900/30"
                                            >
                                                <span className="text-sm font-medium text-red-800 dark:text-red-200">
                                                    {bahan.nama_barang}
                                                </span>
                                                <span className="text-xs text-red-600 dark:text-red-400">
                                                    {bahan.stok} {bahan.satuan}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                                {bahanStokRendah.length > 6 && (
                                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                                        ... dan {bahanStokRendah.length - 6}{' '}
                                        bahan lainnya
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Bahan Card */}
                    <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gray-50 dark:bg-gray-700"></div>
                        <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-600"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/30">
                                    <FaBox className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Bahan
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.totalBahan}
                                </p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Item tersedia
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bahan Masuk Card */}
                    <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gray-50 dark:bg-gray-700"></div>
                        <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-600"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/30">
                                    <FaWarehouse className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Bahan Masuk
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.bahanMasukBulanIni}
                                </p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Bulan ini
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bahan Keluar Card */}
                    <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gray-50 dark:bg-gray-700"></div>
                        <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-600"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="rounded-lg bg-orange-50 p-3 dark:bg-orange-900/30">
                                    <FaTruck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Bahan Keluar
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.bahanKeluarBulanIni}
                                </p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Bulan ini
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stok Rendah Card */}
                    <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gray-50 dark:bg-gray-700"></div>
                        <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-600"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/30">
                                    <FaBox className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Stok Rendah
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.stokRendah}
                                </p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Perlu restok
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Monthly Trend Chart */}
                    <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Trend Bahan Masuk & Keluar (6 Bulan Terakhir)
                        </h3>
                        {monthlyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={monthlyData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="opacity-30"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        className="text-gray-600 dark:text-gray-400"
                                    />
                                    <YAxis className="text-gray-600 dark:text-gray-400" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow:
                                                '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="masuk"
                                        stackId="1"
                                        stroke="#10B981"
                                        fill="#10B981"
                                        fillOpacity={0.3}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="keluar"
                                        stackId="1"
                                        stroke="#F59E0B"
                                        fill="#F59E0B"
                                        fillOpacity={0.3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-[300px] items-center justify-center text-gray-500 dark:text-gray-400">
                                Belum ada data transaksi
                            </div>
                        )}
                    </div>

                    {/* Stock Distribution Chart */}
                    <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Distribusi Status Stok
                        </h3>
                        {stockData.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={stockData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {stockData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                boxShadow:
                                                    '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 flex justify-center space-x-4">
                                    {stockData.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center"
                                        >
                                            <div
                                                className="mr-2 h-3 w-3 rounded-full"
                                                style={{
                                                    backgroundColor: item.color,
                                                }}
                                            ></div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {item.name} ({item.value})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex h-[300px] items-center justify-center text-gray-500 dark:text-gray-400">
                                Belum ada data bahan
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </OwnerLayout>
    );
}
