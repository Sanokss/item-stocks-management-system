import OwnerLayout from '@/Layouts/OwnerLayout';
import { Link, router, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

interface Barang {
    id: number;
    nama_barang: string;
    satuan: string;
    stok: number;
}

interface BarangMasuk {
    id: number;
    barang_id: number;
    jumlah: number;
    tanggal_masuk: string;
    keterangan: string;
    barang: Barang;
}

interface EditProps {
    dataBarangMasuk: BarangMasuk;
    dataBarang: Barang[];
}

export default function Edit({ dataBarangMasuk, dataBarang }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        barang_id: dataBarangMasuk.barang_id,
        jumlah: dataBarangMasuk.jumlah,
        tanggal_masuk: dataBarangMasuk.tanggal_masuk,
        keterangan: dataBarangMasuk.keterangan,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('owner.barang-masuk.update', { id: dataBarangMasuk.id }), {
            onSuccess: () => {
                // Get selected barang name for toast
                const selectedBarang = dataBarang.find(
                    (barang) => barang.id === data.barang_id,
                );

                // Show success toast
                toast.success(
                    `Data bahan masuk "${selectedBarang?.nama_barang}" berhasil diperbarui!`,
                );

                // Redirect to index after 2 seconds
                setTimeout(() => {
                    router.visit(route('owner.barang-masuk.index'));
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
                <Link
                    href={route('owner.barang-masuk.index')}
                    className="text-blue-500 hover:underline"
                >
                    ← Kembali ke Daftar Barang Masuk
                </Link>

                <h1 className="my-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Edit Bahan Masuk
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="barang_id"
                        >
                            Nama Bahan
                        </label>
                        <select
                            id="barang_id"
                            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            value={data.barang_id}
                            onChange={(e) =>
                                setData('barang_id', parseInt(e.target.value))
                            }
                            required
                        >
                            <option value="">Pilih Bahan</option>
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

                    <div className="mb-4">
                        <label
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="jumlah"
                        >
                            Jumlah
                        </label>
                        <input
                            type="number"
                            onWheel={(e) => e.currentTarget.blur()}
                            id="jumlah"
                            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="Masukkan jumlah bahan"
                            value={data.jumlah}
                            onChange={(e) =>
                                setData('jumlah', parseInt(e.target.value))
                            }
                            min="1"
                            max="1000000"
                            required
                        />
                        {errors.jumlah && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.jumlah}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="tanggal_masuk"
                        >
                            Tanggal Masuk
                        </label>
                        <input
                            type="date"
                            id="tanggal_masuk"
                            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            value={data.tanggal_masuk}
                            onChange={(e) =>
                                setData('tanggal_masuk', e.target.value)
                            }
                            required
                        />
                        {errors.tanggal_masuk && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.tanggal_masuk}
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
                            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="Masukkan keterangan (opsional)"
                            value={data.keterangan}
                            onChange={(e) =>
                                setData('keterangan', e.target.value)
                            }
                            rows={3}
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
                            disabled={processing}
                            className="rounded bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Perbarui Data'}
                        </button>

                        <Link
                            href={route('owner.barang-masuk.index')}
                            className="rounded bg-gray-500 px-6 py-2 text-white transition-colors hover:bg-gray-600"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </OwnerLayout>
    );
}
