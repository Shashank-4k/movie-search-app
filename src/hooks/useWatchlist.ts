import { useState, useEffect } from 'react';
import { Movie, WatchlistItem } from '../types';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const stored = localStorage.getItem('cinematic_watchlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cinematic_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (movie: Movie) => {
    setWatchlist(prev => {
      const exists = prev.some(m => m.id === movie.id);
      if (exists) {
        return prev.filter(m => m.id !== movie.id);
      } else {
        return [{ ...movie, savedAt: Date.now(), watched: false }, ...prev];
      }
    });
  };

  const toggleWatched = (id: number) => {
    setWatchlist(prev => prev.map(m => 
      m.id === id ? { ...m, watched: !m.watched } : m
    ));
  };

  const isInWatchlist = (id: number) => watchlist.some(m => m.id === id);

  return { watchlist, toggleWatchlist, toggleWatched, isInWatchlist };
}
