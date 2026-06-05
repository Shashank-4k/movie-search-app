import React from 'react';

export const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" }
];

interface GenreNavProps {
  selectedGenreId: number | null;
  onSelectGenre: (id: number | null) => void;
}

export function GenreNav({ selectedGenreId, onSelectGenre }: GenreNavProps) {
  return (
    <div className="w-full bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 sticky top-[80px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2.5 overflow-x-auto py-3 custom-scrollbar">
          <button
            onClick={() => onSelectGenre(null)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border ${
              selectedGenreId === null
                ? 'bg-slate-900 dark:bg-[#E50914] text-white border-transparent'
                : 'bg-transparent text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30'
            }`}
          >
            Home
          </button>
          {GENRES.map((g) => (
            <button
              key={g.id}
              onClick={() => onSelectGenre(g.id)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border ${
                selectedGenreId === g.id
                  ? 'bg-slate-900 dark:bg-[#E50914] text-white border-transparent'
                  : 'bg-transparent text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
