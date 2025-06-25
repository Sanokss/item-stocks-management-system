import OwnerLayout from '@/Layouts/OwnerLayout';
import { Link, router, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

interface DataBarang {
    dataBarang: {
        id: number;
        nama_barang: string;
        satuan: string;
    };
}

export default function Edit({ dataBarang }: DataBarang) {
    const { data, setData, patch, processing, errors } = useForm({
        nama_barang: dataBarang.nama_barang,
        satuan: dataBarang.satuan,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        patch(route('owner.barang.update', { id: dataBarang.id }), {
            onSuccess: () => {
                // Show success toast
                toast.success(
                    `Bahan "${data.nama_barang}" berhasil diperbarui!`,
                );

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
                <Link
                    href={route('owner.barang.index')}
                    className="text-blue-500 hover:underline"
                >
                    ← Kembali ke Daftar Bahan
                </Link>

                <h1 className="my-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Edit Bahan
                </h1>

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
                            {processing ? 'Menyimpan...' : 'Perbarui Bahan'}
                        </button>

                        <Link
                            href={route('owner.barang.index')}
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
