import OwnerLayout from '@/Layouts/OwnerLayout';
import { useForm } from '@inertiajs/react';

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
        tanggal_masuk: today, // Set default to today
        keterangan: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        post(route('owner.barang-masuk.store'), {
            onFinish: () => {
                setData({
                    barang_id: '',
                    jumlah: '',
                    tanggal_masuk: today, // Reset to today again
                    keterangan: '',
                });
            },
        });
    };

    console.log('Data Barang:', dataBarang);

    return (
        <>
            <OwnerLayout>
                <div className="container mx-auto p-4">
                    <h1 className="mb-4 text-2xl font-bold">
                        Tambah Barang Masuk
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                className="mb-2 block text-sm font-medium"
                                htmlFor="barang_id"
                            >
                                Pilih Barang
                            </label>
                            <select
                                id="barang_id"
                                className="w-full rounded border border-gray-300 p-2"
                                value={data.barang_id}
                                onChange={(e) =>
                                    setData('barang_id', e.target.value)
                                }
                                required
                            >
                                <option value="">Pilih barang</option>
                                {dataBarang.map((barang) => (
                                    <option key={barang.id} value={barang.id}>
                                        {barang.nama_barang} ({barang.satuan})
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
                                className="mb-2 block text-sm font-medium"
                                htmlFor="jumlah"
                            >
                                Jumlah Masuk
                            </label>
                            <input
                                type="number"
                                onWheel={(e) => e.currentTarget.blur()}
                                id="jumlah"
                                className="w-full rounded border border-gray-300 p-2"
                                placeholder="Masukkan jumlah barang masuk"
                                value={data.jumlah}
                                onChange={(e) =>
                                    setData('jumlah', e.target.value)
                                }
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
                                className="mb-2 block text-sm font-medium"
                                htmlFor="tanggal_masuk"
                            >
                                Tanggal Masuk
                            </label>
                            <input
                                type="date"
                                id="tanggal_masuk"
                                className="w-full rounded border border-gray-300 p-2"
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
                                className="mb-2 block text-sm font-medium"
                                htmlFor="keterangan"
                            >
                                Keterangan
                            </label>
                            <textarea
                                id="keterangan"
                                rows={3}
                                className="w-full rounded border border-gray-300 p-2"
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
                        <button
                            type="submit"
                            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                            disabled={processing}
                        >
                            {processing ? 'Menyimpan...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </OwnerLayout>
        </>
    );
}
