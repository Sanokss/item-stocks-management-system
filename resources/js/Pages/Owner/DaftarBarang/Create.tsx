import OwnerLayout from '@/Layouts/OwnerLayout';
import { router, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_barang: '',
        stok: 0,
        satuan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('owner.barang.store'), {
            onSuccess: () => {
                // Show success toast
                toast.success(
                    `Bahan "${data.nama_barang}" berhasil ditambahkan!`,
                );

                // Reset form
                setData({
                    nama_barang: '',
                    stok: 0,
                    satuan: '',
                });

                // Redirect to index after 2 seconds
                setTimeout(() => {
                    router.visit(route('owner.barang.index'));
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
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="name"
                        >
                            Nama Bahan
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="Masukkan nama bahan"
                            value={data.nama_barang}
                            onChange={(e) =>
                                setData('nama_barang', e.target.value)
                            }
                            autoFocus
                            required
                        />
                        {errors.nama_barang && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.nama_barang}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="stock"
                        >
                            Stok Awal Bahan
                        </label>
                        <input
                            type="number"
                            onWheel={(e) => e.currentTarget.blur()}
                            id="stok"
                            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="Masukkan stok awal bahan"
                            value={data.stok}
                            onChange={(e) =>
                                setData('stok', parseInt(e.target.value) || 0)
                            }
                            required
                            min="0"
                            max="1000000"
                        />
                        {errors.stok && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.stok}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="satuan"
                        >
                            Satuan Bahan
                        </label>
                        <input
                            type="text"
                            id="satuan"
                            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="Masukkan satuan bahan (contoh: kg, liter, pcs)"
                            value={data.satuan}
                            onChange={(e) => setData('satuan', e.target.value)}
                            required
                        />
                        {errors.satuan && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.satuan}
                            </div>
                        )}
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Bahan'}
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
