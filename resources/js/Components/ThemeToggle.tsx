// resources/js/components/ThemeToggle.tsx
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="mt-2 rounded bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
        >
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
    );
}
