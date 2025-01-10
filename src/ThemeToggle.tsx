import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './ThemeContext';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4">
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
        <button
          onClick={() => setTheme('light')}
          className={`p-2 rounded-md ${theme === 'light' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          aria-label="Light mode"
        >
          <Sun size={20} />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`p-2 rounded-md ${theme === 'dark' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          aria-label="Dark mode"
        >
          <Moon size={20} />
        </button>
        <button
          onClick={() => setTheme('system')}
          className={`p-2 rounded-md ${theme === 'system' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          aria-label="System theme"
        >
          <Monitor size={20} />
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;