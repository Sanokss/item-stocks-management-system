import OwnerLayout from '@/Layouts/OwnerLayout';
import { router, useForm } from '@inertiajs/react';
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
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        barang_id: '',
        jumlah: '',
        tanggal_masuk: today,
        keterangan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('owner.barang-masuk.store'), {
            onSuccess: () => {
                // Get selected barang name for toast
                const selectedBarang = dataBarang.find(
                    (barang) => barang.id.toString() === data.barang_id,
                );

                // Show success toast
                toast.success(
                    `Bahan masuk "${selectedBarang?.nama_barang}" sebanyak ${data.jumlah} berhasil ditambahkan!`,
                );

                // Reset form
                setData({
                    barang_id: '',
                    jumlah: '',
                    tanggal_masuk: today,
                    keterangan: '',
                });

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
                <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Tambah Barang Masuk
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="barang_id"
                        >
                            Pilih Barang
                        </label>
                        <select
                            id="barang_id"
                            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            value={data.barang_id}
                            onChange={(e) =>
                                setData('barang_id', e.target.value)
                            }
                            required
                        >
                            <option value="">Pilih barang</option>
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
                            Jumlah Masuk
                        </label>
                        <input
                            type="number"
                            onWheel={(e) => e.currentTarget.blur()}
                            id="jumlah"
                            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="Masukkan jumlah barang masuk"
                            value={data.jumlah}
                            onChange={(e) => setData('jumlah', e.target.value)}
                            required
                            min="1"
                            max="1000000"
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
                            disabled={processing}
                            className="rounded bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing
                                ? 'Menyimpan...'
                                : 'Simpan Barang Masuk'}
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
