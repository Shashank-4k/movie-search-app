import React, { useEffect, useState, memo } from 'react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { Loader2 } from 'lucide-react';

interface MovieRowProps {
  title: string;
  fetchFn: () => Promise<Movie[]>;
  onMovieClick: (movie: Movie) => void;
  isInWatchlist: (id: number) => boolean;
  onToggleWatchlist: (e: React.MouseEvent, movie: Movie) => void;
}

export const MovieRow = memo(function MovieRow({ title, fetchFn, onMovieClick, isInWatchlist, onToggleWatchlist }: MovieRowProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchFn().then(data => {
      if (mounted) {
        setMovies(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [fetchFn]);

  if (loading) {
     return <div className="h-48 md:h-64 flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#E50914] animate-spin" /></div>
  }

  if (movies.length === 0) return null;

  return (
    <section className="mb-0">
      <div className="px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-sans font-extrabold tracking-tight uppercase">
          {title}
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-8 snap-x custom-scrollbar">
        {movies.map(movie => (
          <div key={movie.id} className="w-36 md:w-48 shrink-0 snap-start">
            <MovieCard 
              movie={movie}
              onClick={onMovieClick}
              isInWatchlist={isInWatchlist(movie.id)}
              onToggleWatchlist={onToggleWatchlist}
            />
          </div>
        ))}
      </div>
    </section>
  );
});
