import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    const isDark = theme === 'dark';

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', theme);
    }, [theme, isDark]);

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <div className="flex items-center space-x-3">
            <span
                className={`text-lg transition-colors ${isDark ? 'text-blue-400' : 'text-yellow-500'}`}
            >
                {isDark ? (
                    <FaMoon className="h-5 w-5" />
                ) : (
                    <FaSun className="h-5 w-5" />
                )}
            </span>

            <button
                onClick={toggleTheme}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isDark
                        ? 'bg-blue-600 shadow-lg'
                        : 'bg-gray-300 shadow-inner'
                }`}
                role="switch"
                aria-checked={isDark}
                aria-label="Toggle dark mode"
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
                        isDark ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );
}
