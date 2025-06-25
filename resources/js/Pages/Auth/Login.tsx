import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="flex min-h-screen">
                {/* Left Side - Image */}
                <div className="relative hidden bg-blue-600 lg:flex lg:w-1/2">
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
                        <div className="max-w-md text-center">
                            <h1 className="mb-6 text-4xl font-bold">
                                SISTEM INFORMASI STOK GUDANG PANJANG RESTO &
                                CAFE
                            </h1>
                            <p className="mb-8 text-xl text-blue-100">
                                Mempermudah pengelolaan stok gudang dengan
                                antarmuka yang intuitif dan fitur lengkap.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex w-full items-center justify-center bg-gray-50 p-8 lg:w-1/2">
                    <div className="w-full max-w-md">
                        {/* Logo Area */}
                        <div className="mb-8 text-center">
                            <div className="mb-6 flex justify-center">
                                <div className="relative">
                                    <img
                                        src="/images/logo.png"
                                        alt="Logo Panjang Resto & Cafe"
                                        className="h-32 w-32 object-contain sm:h-40 sm:w-40 md:h-48 md:w-48"
                                    />
                                </div>
                            </div>
                            <h2 className="mb-2 text-2xl font-bold text-gray-900">
                                Login
                            </h2>
                            <p className="text-gray-600">
                                Silakan masuk untuk melanjutkan ke sistem
                                informasi stok gudang.
                            </p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                                <div className="text-sm text-green-700">
                                    {status}
                                </div>
                            </div>
                        )}

                        {/* Login Form */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Email"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        autoComplete="username"
                                        isFocused={true}
                                        placeholder="Masukkan email Anda"
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="mt-1 text-sm text-red-600"
                                    />
                                </div>

                                {/* Password Field */}
                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value="Password"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        autoComplete="current-password"
                                        placeholder="Masukkan kata sandi Anda"
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.password}
                                        className="mt-1 text-sm text-red-600"
                                    />
                                </div>
                                {/* Login Button */}
                                <button
                                    className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center">
                                            <svg
                                                className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Loading...
                                        </div>
                                    ) : (
                                        'Login'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
