import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Image as ImageIcon } from 'lucide-react';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <div className="fixed w-full top-4 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="glass border border-slate-200/50 dark:border-slate-700/50 rounded-full px-6 py-3 pointer-events-auto shadow-xl dark:shadow-glow-purple transition-all duration-300 hover:scale-[1.02]">
        <div className="flex justify-between items-center space-x-12">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-accent to-purple-500 text-white p-2 rounded-xl shadow-glow transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
              <ImageIcon size={22} />
            </div>
            <span className="font-heading font-black text-xl tracking-tight text-slate-900 dark:text-white transition-colors group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent group-hover:to-purple-500">
              ConvertPro
            </span>
          </Link>

          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all hover:scale-110 active:scale-95"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun size={20} className="text-amber-400 hover:animate-spin-slow" /> : <Moon size={20} className="text-slate-600 hover:text-accent" />}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
