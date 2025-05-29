import OwnerLayout from '@/Layouts/OwnerLayout';
import { useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_barang: '',
        stok: 0,
        satuan: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        post(route('owner.barang.store'), {
            onFinish: () => {
                setData({
                    nama_barang: '',
                    stok: 0,
                    satuan: '',
                });
            },
        });
    };
    return (
        <>
            <OwnerLayout>
                <div className="container mx-auto p-4">
                    <h1 className="mb-4 text-2xl font-bold">Tambah Barang</h1>
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
                                htmlFor="stock"
                            >
                                Stok Awal Barang
                            </label>
                            <input
                                type="number"
                                onWheel={(e) => e.currentTarget.blur()}
                                id="stok"
                                className="w-full rounded border border-gray-300 p-2"
                                placeholder="Masukkan stok awal barang"
                                value={data.stok}
                                onChange={(e) =>
                                    setData('stok', parseInt(e.target.value))
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
