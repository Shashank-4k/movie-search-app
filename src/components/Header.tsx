import React, { useState } from 'react';
import { Search, Film, Moon, Sun, Library } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  isDark: boolean;
  onToggleDark: () => void;
  currentView: 'home' | 'watchlist';
  onChangeView: (view: 'home' | 'watchlist') => void;
}

export function Header({ searchQuery, onSearch, isDark, onToggleDark, currentView, onChangeView }: HeaderProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  React.useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onSearch(localQuery.trim());
      onChangeView('home');
    } else {
      onSearch('');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-[#050505]/80 border-b border-slate-200 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div 
          className="flex items-center gap-3 cursor-pointer flex-shrink-0"
          onClick={() => { setLocalQuery(''); onSearch(''); onChangeView('home'); }}
        >
          <div className="w-10 h-10 rounded-xl bg-[#E50914] flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.4)]">
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight hidden sm:block text-slate-900 dark:text-white uppercase">
            MovieDX
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 max-w-xl relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/20" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search titles, actors, or directors..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-full text-sm focus:ring-1 focus:ring-indigo-500 dark:focus:ring-[#E50914] dark:focus:border-[#E50914] text-slate-900 dark:text-white transition-all font-sans placeholder-slate-400 dark:placeholder-white/20 outline-none"
          />
        </form>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full border border-green-500/20 tracking-wider">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            OFFLINE READY
          </div>
          <button
            onClick={() => onChangeView('watchlist')}
            className={`p-2.5 rounded-xl transition-colors flex items-center gap-2 ${
              currentView === 'watchlist' 
                ? 'bg-indigo-100 dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm border border-transparent dark:border-white/20' 
                : 'text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-white/5'
            }`}
            aria-label="View watchlist"
          >
            <Library className="w-5 h-5" />
            <span className="hidden lg:block font-bold text-sm">Watchlist</span>
          </button>
          <button
            onClick={onToggleDark}
            className="p-2.5 rounded-xl text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
