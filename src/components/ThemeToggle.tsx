import { useEffect, useState } from 'react';

const getInitialIsDark = () => document.documentElement.classList.contains('dark');

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(getInitialIsDark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setIsDark((v) => !v)}
      className="text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 p-sm rounded transition-all duration-300 ease-in-out flex items-center justify-center"
    >
      <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
    </button>
  );
};

export default ThemeToggle;
