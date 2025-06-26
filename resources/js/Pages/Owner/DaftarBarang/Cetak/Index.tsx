import OwnerLayout from '@/Layouts/OwnerLayout';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaCalendarAlt, FaFileExcel, FaFilePdf } from 'react-icons/fa';

export default function Index() {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const [tanggalAwal, setTanggalAwal] = useState(today);
    const [tanggalAkhir, setTanggalAkhir] = useState(today);
    const [isLoadingExcel, setIsLoadingExcel] = useState(false);
    const [isLoadingPdf, setIsLoadingPdf] = useState(false);

    const validateDates = () => {
        if (!tanggalAwal || !tanggalAkhir) {
            toast.error(
                'Silakan pilih tanggal awal dan tanggal akhir terlebih dahulu',
            );
            return false;
        }

        if (new Date(tanggalAwal) > new Date(tanggalAkhir)) {
            toast.error(
                'Tanggal awal tidak boleh lebih besar dari tanggal akhir',
            );
            return false;
        }

        return true;
    };

    const getCSRFToken = () => {
        const token = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');

        if (!token) {
            toast.error('CSRF token tidak ditemukan. Silakan refresh halaman.');
            return null;
        }
        return token;
    };

    const createFormAndSubmit = (action: string, onComplete: () => void) => {
        const token = getCSRFToken();
        if (!token) return;

        // Create and submit form with proper CSRF token
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = action;
        form.style.display = 'none';

        // Add CSRF token
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = token;
        form.appendChild(csrfInput);

        // Add date inputs
        const tanggalAwalInput = document.createElement('input');
        tanggalAwalInput.type = 'hidden';
        tanggalAwalInput.name = 'tanggal_awal';
        tanggalAwalInput.value = tanggalAwal;
        form.appendChild(tanggalAwalInput);

        const tanggalAkhirInput = document.createElement('input');
        tanggalAkhirInput.type = 'hidden';
        tanggalAkhirInput.name = 'tanggal_akhir';
        tanggalAkhirInput.value = tanggalAkhir;
        form.appendChild(tanggalAkhirInput);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        setTimeout(onComplete, 3000);
    };

    const handleExportExcel = () => {
        if (!validateDates()) return;

        setIsLoadingExcel(true);
        createFormAndSubmit(route('owner.barang.export-excel'), () => {
            setIsLoadingExcel(false);
            toast.success('File Excel berhasil diunduh!');
        });
    };

    const handleExportPdf = () => {
        if (!validateDates()) return;

        setIsLoadingPdf(true);
        createFormAndSubmit(route('owner.barang.export-pdf'), () => {
            setIsLoadingPdf(false);
            toast.success('File PDF berhasil diunduh!');
        });
    };

    const resetForm = () => {
        setTanggalAwal(today);
        setTanggalAkhir(today);
    };

    return (
        <OwnerLayout>
            <div className="container mx-auto p-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Cetak Laporan Daftar Bahan
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Pilih rentang tanggal dan format file untuk mencetak
                        laporan daftar bahan
                    </p>
                </div>

                {/* Form */}
                <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow dark:bg-gray-800">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Tanggal Awal */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                <FaCalendarAlt className="mr-2 inline h-4 w-4" />
                                Tanggal Awal
                            </label>
                            <input
                                type="date"
                                value={tanggalAwal}
                                onChange={(e) => setTanggalAwal(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                required
                            />
                        </div>

                        {/* Tanggal Akhir */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                <FaCalendarAlt className="mr-2 inline h-4 w-4" />
                                Tanggal Akhir
                            </label>
                            <input
                                type="date"
                                value={tanggalAkhir}
                                onChange={(e) =>
                                    setTanggalAkhir(e.target.value)
                                }
                                min={tanggalAwal}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                required
                            />
                        </div>
                    </div>

                    {/* Export Buttons */}
                    <div className="mt-6">
                        <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Pilih Format Export
                        </label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {/* Excel Button */}
                            <button
                                onClick={handleExportExcel}
                                disabled={isLoadingExcel || isLoadingPdf}
                                className="inline-flex items-center justify-center space-x-2 rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600"
                            >
                                <FaFileExcel className="h-4 w-4" />
                                <span>
                                    {isLoadingExcel
                                        ? 'Mengunduh...'
                                        : 'Export Excel'}
                                </span>
                            </button>

                            {/* PDF Button */}
                            <button
                                onClick={handleExportPdf}
                                disabled={isLoadingExcel || isLoadingPdf}
                                className="inline-flex items-center justify-center space-x-2 rounded-md bg-red-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600"
                            >
                                <FaFilePdf className="h-4 w-4" />
                                <span>
                                    {isLoadingPdf
                                        ? 'Mengunduh...'
                                        : 'Export PDF'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Reset Button */}
                    <div className="mt-4">
                        <button
                            onClick={resetForm}
                            className="w-full rounded-md bg-gray-100 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            Reset Tanggal
                        </button>
                    </div>

                    {/* Preview Info */}
                    {tanggalAwal && tanggalAkhir && (
                        <div className="mt-6 rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                Preview Laporan
                            </h3>
                            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                                Laporan akan menampilkan data bahan dari tanggal{' '}
                                <strong>
                                    {new Date(tanggalAwal).toLocaleDateString(
                                        'id-ID',
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        },
                                    )}
                                </strong>{' '}
                                sampai{' '}
                                <strong>
                                    {new Date(tanggalAkhir).toLocaleDateString(
                                        'id-ID',
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        },
                                    )}
                                </strong>
                            </p>
                            <div className="mt-2 space-y-1">
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                    📄 Excel: Laporan_Daftar_Bahan_
                                    {new Date(tanggalAwal)
                                        .toLocaleDateString('id-ID')
                                        .replace(/\//g, '-')}
                                    _sampai_
                                    {new Date(tanggalAkhir)
                                        .toLocaleDateString('id-ID')
                                        .replace(/\//g, '-')}
                                    .xlsx
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                    📋 PDF: Laporan_Daftar_Bahan_
                                    {new Date(tanggalAwal)
                                        .toLocaleDateString('id-ID')
                                        .replace(/\//g, '-')}
                                    _sampai_
                                    {new Date(tanggalAkhir)
                                        .toLocaleDateString('id-ID')
                                        .replace(/\//g, '-')}
                                    .pdf
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </OwnerLayout>
    );
}
