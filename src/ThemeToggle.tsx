import React, { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './ThemeContext';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const ThemeIcon = {
    light: Sun,
    dark: Moon,
    system: Monitor
  }[theme];

  return (
    <div className="fixed top-4 right-4 sm:right-6 z-50">
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md"
          aria-label="Toggle theme menu"
        >
          <ThemeIcon size={20} className="text-gray-700 dark:text-gray-300" />
        </button>

        {isExpanded && (
          <div 
            className="absolute right-0 mt-2 py-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black/5 backdrop-blur-sm"
            onMouseLeave={() => setIsExpanded(false)}
          >
            <button
              onClick={() => { setTheme('light'); setIsExpanded(false); }}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Sun size={16} className="mr-2" />
              Light
            </button>
            <button
              onClick={() => { setTheme('dark'); setIsExpanded(false); }}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Moon size={16} className="mr-2" />
              Dark
            </button>
            <button
              onClick={() => { setTheme('system'); setIsExpanded(false); }}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Monitor size={16} className="mr-2" />
              System
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeToggle;