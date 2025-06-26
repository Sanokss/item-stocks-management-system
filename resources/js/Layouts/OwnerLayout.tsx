import StockNotification from '@/Components/StockNotification';
import ThemeToggle from '@/Components/ThemeToggle';
import { useNotificationStore } from '@/stores/notificationStore';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import {
    FaArrowLeft,
    FaArrowRight,
    FaDownload,
    FaUpload,
    FaUser,
} from 'react-icons/fa6';
import { HiTemplate } from 'react-icons/hi';
import { RiDashboardHorizontalLine } from 'react-icons/ri';

export default function OwnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { url, props } = usePage();
    const user = props.auth?.user;

    // Get notification store actions
    const { setLowStockItems } = useNotificationStore();

    // Load initial stock data and check for low stock items
    useEffect(() => {
        // Fetch current stock data from backend
        fetch(route('owner.barang.stock-check'))
            .then((response) => response.json())
            .then((data) => {
                if (data.lowStockItems) {
                    setLowStockItems(data.lowStockItems);
                }
            })
            .catch((error) => console.error('Error checking stock:', error));
    }, [setLowStockItems]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const isActive = (routeName: string) => {
        return url.startsWith(route(routeName));
    };

    // Function to get page title based on current URL
    const getPageTitle = () => {
        if (url.startsWith('/owner/dashboard')) {
            return 'Dashboard';
        } else if (url.startsWith('/owner/barang-masuk/cetak')) {
            return 'Cetak Laporan Bahan Masuk';
        } else if (url.startsWith('/owner/barang-masuk/create')) {
            return 'Tambah Bahan Masuk';
        } else if (url.match(/\/owner\/barang-masuk\/\d+\/edit/)) {
            return 'Edit Bahan Masuk';
        } else if (url.startsWith('/owner/barang-masuk')) {
            return 'Bahan Masuk';
        } else if (url.startsWith('/owner/barang-keluar/cetak')) {
            return 'Cetak Laporan Bahan Keluar';
        } else if (url.startsWith('/owner/barang-keluar/create')) {
            return 'Tambah Bahan Keluar';
        } else if (url.match(/\/owner\/barang-keluar\/\d+\/edit/)) {
            return 'Edit Bahan Keluar';
        } else if (url.startsWith('/owner/barang-keluar')) {
            return 'Bahan Keluar';
        } else if (url.startsWith('/owner/barang/cetak')) {
            return 'Cetak Laporan Daftar Bahan';
        } else if (url.startsWith('/owner/barang/create')) {
            return 'Tambah Bahan';
        } else if (url.match(/\/owner\/barang\/\d+\/edit/)) {
            return 'Edit Bahan';
        } else if (url.startsWith('/owner/barang')) {
            return 'Daftar Bahan';
        } else {
            return 'Dashboard'; // Default fallback
        }
    };

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            router.post(route('logout'));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="flex h-screen">
                {/* Sidebar */}
                <div
                    className={`bg-white shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800 ${
                        sidebarOpen ? 'w-64' : 'w-16'
                    }`}
                >
                    <div className="flex h-full flex-col justify-between">
                        {/* Sidebar Header */}
                        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                            <div className="mt-4 flex items-center justify-between">
                                {sidebarOpen && (
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Menu
                                    </h2>
                                )}
                                <button
                                    onClick={toggleSidebar}
                                    className="rounded-md border p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                                    aria-label={
                                        sidebarOpen
                                            ? 'Collapse sidebar'
                                            : 'Expand sidebar'
                                    }
                                >
                                    {sidebarOpen ? (
                                        <FaArrowLeft className="h-5 w-5" />
                                    ) : (
                                        <FaArrowRight className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Sidebar Content */}
                        <div className="flex flex-1 flex-col justify-between overflow-y-auto p-4">
                            <div>
                                <nav className="space-y-2">
                                    <Link
                                        href={route('owner.dashboard')}
                                        className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                            isActive('owner.dashboard')
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <RiDashboardHorizontalLine />
                                        <span
                                            className={`${
                                                !sidebarOpen && 'hidden'
                                            } ml-3`}
                                        >
                                            Dashboard
                                        </span>
                                    </Link>
                                    <Link
                                        href={route('owner.barang.index')}
                                        className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                            isActive('owner.barang.index')
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <HiTemplate />
                                        <span
                                            className={`${
                                                !sidebarOpen && 'hidden'
                                            } ml-3`}
                                        >
                                            Daftar Bahan
                                        </span>
                                    </Link>
                                    <Link
                                        href={route('owner.barang-masuk.index')}
                                        className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                            isActive('owner.barang-masuk.index')
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <FaDownload />
                                        <span
                                            className={`${
                                                !sidebarOpen && 'hidden'
                                            } ml-3`}
                                        >
                                            Bahan Masuk
                                        </span>
                                    </Link>
                                    <Link
                                        href={route(
                                            'owner.barang-keluar.index',
                                        )}
                                        className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                            isActive(
                                                'owner.barang-keluar.index',
                                            )
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <FaUpload />
                                        <span
                                            className={`${
                                                !sidebarOpen && 'hidden'
                                            } ml-3`}
                                        >
                                            Bahan Keluar
                                        </span>
                                    </Link>
                                </nav>
                            </div>

                            {/* User Profile & Logout Section */}
                            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                                {/* User Profile */}
                                {sidebarOpen && user && (
                                    <div className="mb-3 rounded-md bg-gray-50 p-3 dark:bg-gray-700">
                                        <div className="flex items-center">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                                                <FaUser className="h-4 w-4" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                    <FaSignOutAlt />
                                    <span
                                        className={`${
                                            !sidebarOpen && 'hidden'
                                        } ml-3`}
                                    >
                                        Logout
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    <header className="bg-white shadow dark:bg-gray-800">
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {getPageTitle()} - PANJANG RESTO & CAFE
                            </h1>

                            {/* Header Right Section */}
                            <div className="flex items-center space-x-4">
                                {/* User Info (when sidebar is collapsed) */}
                                {!sidebarOpen && user && (
                                    <div className="hidden items-center space-x-3 md:flex">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {user.name}
                                        </span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                                            <FaUser className="h-4 w-4" />
                                        </div>
                                    </div>
                                )}

                                {/* Stock Notification */}
                                <StockNotification />

                                {/* Theme Toggle Button */}
                                <ThemeToggle />
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
