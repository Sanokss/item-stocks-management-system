import { useNotificationStore } from '@/stores/notificationStore';
import { Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { FaBell, FaExclamationTriangle } from 'react-icons/fa';

export default function StockNotification() {
    const {
        lowStockItems,
        isNotificationOpen,
        unreadCount,
        toggleNotification,
        closeNotification,
        markAsRead,
    } = useNotificationStore();

    const notificationRef = useRef<HTMLDivElement>(null);

    // Close notification when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                closeNotification();
            }
        };

        if (isNotificationOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNotificationOpen, closeNotification]);

    const handleNotificationClick = () => {
        toggleNotification();
        if (!isNotificationOpen) {
            markAsRead();
        }
    };

    return (
        <div className="relative" ref={notificationRef}>
            {/* Notification Bell Button */}
            <button
                onClick={handleNotificationClick}
                className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                aria-label="Notifications"
            >
                <FaBell className="h-5 w-5" />

                {/* Notification Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700">
                    <div className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Stok Menipis
                            </h3>
                            {lowStockItems.length > 0 && (
                                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                    {lowStockItems.length} item
                                </span>
                            )}
                        </div>

                        {/* Notification Items */}
                        <div className="max-h-64 overflow-y-auto">
                            {lowStockItems.length === 0 ? (
                                <div className="py-8 text-center">
                                    <FaBell className="mx-auto h-8 w-8 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Tidak ada stok yang menipis
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {lowStockItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start space-x-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20"
                                        >
                                            <FaExclamationTriangle className="mt-0.5 h-4 w-4 text-red-500" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {item.nama_barang}
                                                </p>
                                                <p className="text-xs text-red-600 dark:text-red-400">
                                                    Stok tersisa: {item.stok}{' '}
                                                    {item.satuan}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {lowStockItems.length > 0 && (
                            <div className="mt-4 flex space-x-2">
                                <Link
                                    href={route('owner.barang.index')}
                                    onClick={closeNotification}
                                    className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Lihat Daftar Bahan
                                </Link>
                                <Link
                                    href={route('owner.barang-masuk.create')}
                                    onClick={closeNotification}
                                    className="flex-1 rounded-md bg-green-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    Tambah Stok
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
