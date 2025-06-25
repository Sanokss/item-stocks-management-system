import OwnerLayout from '@/Layouts/OwnerLayout';
import { Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
    FaChevronLeft,
    FaChevronRight,
    FaFilter,
    FaPlus,
    FaPrint,
    FaSearch,
} from 'react-icons/fa';

interface Barang {
    id: number;
    nama_barang: string;
    stok: number;
    satuan: string;
    created_at: string;
}

interface IndexProps {
    dataBarang: Barang[];
    title: string;
    description: string;
}

export default function Index({ dataBarang }: IndexProps) {
    // State for search, filter, and pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [quantityFilter, setQuantityFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Delete function
    const handleDelete = (id: number, namaBarang: string) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus bahan "${namaBarang}"?\n\nData yang dihapus tidak dapat dikembalikan.`,
            )
        ) {
            router.delete(route('owner.barang.destroy', { id }), {
                onSuccess: () => {
                    toast.success(`Bahan "${namaBarang}" berhasil dihapus`);
                },
                onError: (errors) => {
                    console.error('Error deleting:', errors);
                    toast.error('Gagal menghapus bahan');
                },
            });
        }
    };

    // Filter and search logic
    const filteredData = useMemo(() => {
        let filtered = dataBarang || [];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter((item) =>
                item.nama_barang
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
            );
        }

        // Date filter
        if (dateFilter) {
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item.created_at);
                const filterDate = new Date(dateFilter);
                return itemDate.toDateString() === filterDate.toDateString();
            });
        }

        // Quantity filter
        if (quantityFilter) {
            filtered = filtered.filter((item) => {
                switch (quantityFilter) {
                    case 'low':
                        return item.stok <= 10;
                    case 'medium':
                        return item.stok > 10 && item.stok <= 50;
                    case 'high':
                        return item.stok > 50;
                    default:
                        return true;
                }
            });
        }

        return filtered;
    }, [dataBarang, searchTerm, dateFilter, quantityFilter]);

    // Pagination logic
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, dateFilter, quantityFilter]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setDateFilter('');
        setQuantityFilter('');
        setCurrentPage(1);
    };

    return (
        <OwnerLayout>
            <div className="container mx-auto p-4">
                {/* Header Section with Add Button */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Daftar Bahan
                        </h1>
                        <p className="max-w-2xl text-gray-600 dark:text-gray-400">
                            Daftar bahan yang tersedia di sistem. Anda dapat
                            menambahkan, mengedit, atau menghapus barang sesuai
                            kebutuhan.
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href={route('owner.barang.cetak')}
                            className="inline-flex items-center space-x-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-700 dark:hover:bg-green-600"
                        >
                            <FaPrint className="h-4 w-4" />
                            <span>Cetak Laporan</span>
                        </Link>
                        <Link
                            href={route('owner.barang.create')}
                            className="inline-flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
                        >
                            <FaPlus className="h-4 w-4" />
                            <span>Tambah Bahan</span>
                        </Link>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-6 rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Search */}
                        <div className="relative">
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Cari Bahan
                            </label>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari nama bahan atau keterangan..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tanggal
                            </label>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>

                        {/* Quantity Filter */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Jumlah
                            </label>
                            <select
                                value={quantityFilter}
                                onChange={(e) =>
                                    setQuantityFilter(e.target.value)
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            >
                                <option value="">Semua Jumlah</option>
                                <option value="low">Rendah (≤ 10)</option>
                                <option value="medium">Sedang (11-50)</option>
                                <option value="high">Tinggi ({'>'} 50)</option>
                            </select>
                        </div>

                        {/* Items per page */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Item per Halaman
                            </label>
                            <select
                                value={itemsPerPage}
                                onChange={(e) =>
                                    setItemsPerPage(Number(e.target.value))
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    <div className="mt-4 flex items-center justify-between">
                        <button
                            onClick={clearFilters}
                            className="flex items-center space-x-2 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            <FaFilter className="h-4 w-4" />
                            <span>Clear Filters</span>
                        </button>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Menampilkan {startIndex + 1}-
                            {Math.min(endIndex, totalItems)} dari {totalItems}{' '}
                            item
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Daftar Bahan Masuk
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                        No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                        Nama Bahan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                        Stok
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                        Satuan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                        Tanggal Dibuat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                {currentData && currentData.length > 0 ? (
                                    currentData.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                {startIndex + index + 1}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {item.nama_barang}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        item.stok <= 10
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                            : item.stok <= 50
                                                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    }`}
                                                >
                                                    {item.stok}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm uppercase text-gray-900 dark:text-gray-100">
                                                {item.satuan}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                {formatDate(item.created_at)}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route(
                                                            'owner.barang.edit',
                                                            { id: item.id },
                                                        )}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id,
                                                                item.nama_barang,
                                                            )
                                                        }
                                                        className="text-red-600 transition-colors duration-200 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            {searchTerm ||
                                            dateFilter ||
                                            quantityFilter
                                                ? 'Tidak ada data yang sesuai dengan filter'
                                                : 'Tidak ada data bahan masuk'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Menampilkan{' '}
                                        <span className="font-medium">
                                            {startIndex + 1}
                                        </span>{' '}
                                        hingga{' '}
                                        <span className="font-medium">
                                            {Math.min(endIndex, totalItems)}
                                        </span>{' '}
                                        dari{' '}
                                        <span className="font-medium">
                                            {totalItems}
                                        </span>{' '}
                                        hasil
                                    </p>
                                </div>
                                <div>
                                    <nav
                                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                        aria-label="Pagination"
                                    >
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage - 1,
                                                )
                                            }
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-gray-600 dark:hover:bg-gray-700"
                                        >
                                            <FaChevronLeft className="h-5 w-5" />
                                        </button>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() =>
                                                    handlePageChange(i + 1)
                                                }
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                    currentPage === i + 1
                                                        ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage + 1,
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-gray-600 dark:hover:bg-gray-700"
                                        >
                                            <FaChevronRight className="h-5 w-5" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </OwnerLayout>
    );
}
