import { useEffect } from 'react';
import { FaCheckCircle, FaTimes, FaTimesCircle } from 'react-icons/fa';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'success' | 'error';
    title: string;
    message: string;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

export default function NotificationModal({
    isOpen,
    onClose,
    type,
    title,
    message,
    autoClose = true,
    autoCloseDelay = 3000,
}: NotificationModalProps) {
    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);

            return () => clearTimeout(timer);
        }
    }, [isOpen, autoClose, autoCloseDelay, onClose]);

    console.log('NotificationModal render:', { isOpen, type, title, message });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {type === 'success' ? (
                            <FaCheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                            <FaTimesCircle className="h-6 w-6 text-red-500" />
                        )}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <h3
                            className={`text-lg font-medium ${
                                type === 'success'
                                    ? 'text-green-800'
                                    : 'text-red-800'
                            } dark:text-white`}
                        >
                            {title}
                        </h3>
                        <p
                            className={`mt-1 text-sm ${
                                type === 'success'
                                    ? 'text-green-700'
                                    : 'text-red-700'
                            } dark:text-gray-300`}
                        >
                            {message}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-4 flex-shrink-0 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
                            type === 'success'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
