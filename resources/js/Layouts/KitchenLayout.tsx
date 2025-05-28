import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    FaArrowLeft,
    FaArrowRight,
    FaDownload,
    FaUpload,
} from 'react-icons/fa6';
import { RiDashboardHorizontalLine } from 'react-icons/ri';

export default function KitchenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
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

                        {/* Sidebar Content + ThemeToggle */}
                        <div className="flex flex-1 flex-col justify-between overflow-y-auto p-4">
                            <div>
                                <nav className="space-y-2">
                                    <Link
                                        href="#"
                                        className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
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
                                        href="#"
                                        className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        <FaDownload />
                                        <span
                                            className={`${
                                                !sidebarOpen && 'hidden'
                                            } ml-3`}
                                        >
                                            Barang Masuk
                                        </span>
                                    </Link>
                                    <Link
                                        href="#"
                                        className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        <FaUpload />
                                        <span
                                            className={`${
                                                !sidebarOpen && 'hidden'
                                            } ml-3`}
                                        >
                                            Barang Keluar
                                        </span>
                                    </Link>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    <header className="bg-white shadow dark:bg-gray-800">
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                Head Kitchen Dashboard
                            </h1>

                            {/* Theme Toggle Button */}
                            <div className={`${!sidebarOpen && 'text-center'}`}>
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
