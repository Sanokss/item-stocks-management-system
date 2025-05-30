import OwnerLayout from '@/Layouts/OwnerLayout';
import { Link, useForm } from '@inertiajs/react';

interface DataBarang {
    dataBarang: {
        id: number;
        nama_barang: string;
        satuan: string;
    };
}

export default function Create({ dataBarang }: DataBarang) {
    const { data, setData, patch, processing, errors } = useForm({
        nama_barang: dataBarang.nama_barang,
        satuan: dataBarang.satuan,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('owner.barang.update', { id: dataBarang.id }), {
            onFinish: () => {
                setData({
                    nama_barang: '',
                    satuan: '',
                });
            },
        });
    };
    return (
        <>
            <OwnerLayout>
                <div className="container mx-auto p-4">
                    <Link
                        href={route('owner.barang.index')}
                        className="text-blue-500 hover:underline"
                    >
                        Kembali
                    </Link>
                    <h1 className="my-4 text-2xl font-bold">Edit Barang</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                className="mb-2 block text-sm font-medium"
                                htmlFor="name"
                            >
                                Nama Barang
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full rounded border border-gray-300 p-2"
                                placeholder="Masukkan nama barang"
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
                                className="mb-2 block text-sm font-medium"
                                htmlFor="satuan"
                            >
                                Satuan Barang
                            </label>
                            <input
                                type="text"
                                id="satuan"
                                className="w-full rounded border border-gray-300 p-2"
                                placeholder="Masukkan satuan barang"
                                value={data.satuan}
                                onChange={(e) =>
                                    setData('satuan', e.target.value)
                                }
                                required
                            />
                            {errors.satuan && (
                                <div className="mt-1 text-sm text-red-500">
                                    {errors.satuan}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                            {processing ? 'Menyimpan...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </OwnerLayout>
        </>
    );
}
