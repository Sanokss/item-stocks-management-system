import OwnerLayout from '@/Layouts/OwnerLayout';
import { useNotificationStore } from '@/stores/notificationStore';
import { router, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

interface Barang {
    id: number;
    nama_barang: string;
    stok: number;
    satuan: string;
}

interface Props {
    dataBarang: Barang[];
}

export default function Create({ dataBarang }: Props) {
    const { checkStockLevel } = useNotificationStore();

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        barang_id: '',
        jumlah: '',
        tanggal_keluar: today,
        keterangan: '',
    });

    // Get selected barang info
    const selectedBarang = useMemo(() => {
        if (!data.barang_id) return null;
        return dataBarang.find(
            (barang) => barang.id === parseInt(data.barang_id),
        );
    }, [data.barang_id, dataBarang]);

    // Check if quantity exceeds stock
    const isQuantityValid = useMemo(() => {
        if (!selectedBarang || !data.jumlah) return true;
        return parseInt(data.jumlah) <= selectedBarang.stok;
    }, [selectedBarang, data.jumlah]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Additional frontend validation
        if (!isQuantityValid) {
            toast.error('Jumlah yang dimasukkan melebihi stok yang tersedia!');
            return;
        }

        post(route('owner.barang-keluar.store'), {
            onSuccess: () => {
                // Check if stock becomes low after transaction
                const selectedBarang = dataBarang.find(
                    (barang) => barang.id === parseInt(data.barang_id),
                );

                if (selectedBarang) {
                    const newStock =
                        selectedBarang.stok - parseInt(data.jumlah);
                    checkStockLevel(
                        {
                            id: selectedBarang.id,
                            nama_barang: selectedBarang.nama_barang,
                            stok: newStock,
                            satuan: selectedBarang.satuan,
                        },
                        10, // minimum stock = 10
                    );
                }

                // Show success toast
                toast.success(
                    `Bahan keluar "${selectedBarang?.nama_barang}" sebanyak ${data.jumlah} berhasil ditambahkan!`,
                );

                // Reset form
                setData({
                    barang_id: '',
                    jumlah: '',
                    tanggal_keluar: today,
                    keterangan: '',
                });

                // Redirect to index after 2 seconds
                setTimeout(() => {
                    router.visit(route('owner.barang-keluar.index'));
                }, 2000);
            },
            onError: (errors) => {
                // Show error toast untuk validation errors
                if (errors.error) {
                    toast.error(errors.error as string);
                } else {
                    const errorMessage = Object.values(errors)
                        .flat()
                        .join(', ');
                    toast.error(`Validasi gagal: ${errorMessage}`);
                }
            },
        });
    };

    return (
        <OwnerLayout>
            <div className="container mx-auto p-4">
                <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Tambah Bahan Keluar
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="barang_id"
                        >
                            Pilih Bahan
                        </label>
                        <select
                            id="barang_id"
                            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            value={data.barang_id}
                            onChange={(e) => {
                                setData('barang_id', e.target.value);
                                // Reset jumlah when changing barang
                                setData('jumlah', '');
                            }}
                            required
                        >
                            <option value="">Pilih bahan</option>
                            {dataBarang.map((barang) => (
                                <option key={barang.id} value={barang.id}>
                                    {barang.nama_barang} ({barang.satuan}) -
                                    Stok: {barang.stok}
                                </option>
                            ))}
                        </select>
                        {errors.barang_id && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.barang_id}
                            </div>
                        )}
                    </div>

                    {/* Stock Information */}
                    {selectedBarang && (
                        <div className="mb-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                Informasi Stok
                            </h3>
                            <p className="text-sm text-blue-600 dark:text-blue-300">
                                Stok tersedia:{' '}
                                <span className="font-semibold">
                                    {selectedBarang.stok}{' '}
                                    {selectedBarang.satuan}
                                </span>
                            </p>
                        </div>
                    )}

                    <div className="mb-4">
                        <label
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="jumlah"
                        >
                            Jumlah Keluar
                        </label>
                        <input
                            type="number"
                            onWheel={(e) => e.currentTarget.blur()}
                            id="jumlah"
                            className={`w-full rounded border p-2 focus:outline-none focus:ring-1 ${
                                !isQuantityValid
                                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:bg-red-900/20'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
                            } dark:text-gray-100`}
                            placeholder="Masukkan jumlah bahan keluar"
                            value={data.jumlah}
                            onChange={(e) => setData('jumlah', e.target.value)}
                            required
                            min="1"
                            max={selectedBarang?.stok || 1000000}
                        />
                        {!isQuantityValid && data.jumlah && selectedBarang && (
                            <div className="mt-1 text-sm text-red-500">
                                Jumlah melebihi stok yang tersedia (
                                {selectedBarang.stok} {selectedBarang.satuan})
                            </div>
                        )}
                        {errors.jumlah && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.jumlah}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="tanggal_keluar"
                        >
                            Tanggal Keluar
                        </label>
                        <input
                            type="date"
                            id="tanggal_keluar"
                            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            value={data.tanggal_keluar}
                            onChange={(e) =>
                                setData('tanggal_keluar', e.target.value)
                            }
                            required
                        />
                        {errors.tanggal_keluar && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.tanggal_keluar}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="keterangan"
                        >
                            Keterangan
                        </label>
                        <textarea
                            id="keterangan"
                            rows={3}
                            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="Masukkan keterangan (opsional)"
                            value={data.keterangan}
                            onChange={(e) =>
                                setData('keterangan', e.target.value)
                            }
                        />
                        {errors.keterangan && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.keterangan}
                            </div>
                        )}
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={processing || !isQuantityValid}
                            className={`rounded px-6 py-2 text-white transition-colors ${
                                processing || !isQuantityValid
                                    ? 'cursor-not-allowed bg-gray-400'
                                    : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        >
                            {processing
                                ? 'Menyimpan...'
                                : 'Simpan Bahan Keluar'}
                        </button>

                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="rounded bg-gray-500 px-6 py-2 text-white transition-colors hover:bg-gray-600"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </OwnerLayout>
    );
}
