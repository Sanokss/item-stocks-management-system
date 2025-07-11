import ThemeToggle from '@/Components/ThemeToggle';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import {
    FaArrowLeft,
    FaArrowRight,
    FaDownload,
    FaUpload,
    FaUser,
} from 'react-icons/fa6';
import { RiDashboardHorizontalLine } from 'react-icons/ri';

export default function KitchenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { url, props } = usePage();
    const user = props.auth?.user;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const isActive = (routeName: string) => {
        return url.startsWith(route(routeName));
    };

    const handleLogout = () => {
        if (confirm('Apakah anda yakin ingin keluar?')) {
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
                                        href={route('kitchen.dashboard')}
                                        className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                            isActive('kitchen.dashboard')
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

                            {/* User Profile & Logout Section */}
                            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                                {/* User Profile */}
                                {sidebarOpen && user && (
                                    <div className="mb-3 rounded-md bg-gray-50 p-3 dark:bg-gray-700">
                                        <div className="flex items-center">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                                                <FaUser className="h-4 w-4" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </p>
                                                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                                    Head Kitchen
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Profile Link */}
                                <Link
                                    href={route('profile.edit')}
                                    className="mb-2 flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    <FaUser />
                                    <span
                                        className={`${
                                            !sidebarOpen && 'hidden'
                                        } ml-3`}
                                    >
                                        Profile
                                    </span>
                                </Link>

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
                                Head Kitchen Dashboard
                            </h1>

                            {/* Header Right Section */}
                            <div className="flex items-center space-x-4">
                                {/* User Info (when sidebar is collapsed) */}
                                {!sidebarOpen && user && (
                                    <div className="hidden items-center space-x-3 md:flex">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {user.name}
                                        </span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                                            <FaUser className="h-4 w-4" />
                                        </div>
                                    </div>
                                )}

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
