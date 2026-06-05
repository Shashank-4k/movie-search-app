import React from 'react';
import { Movie } from '../types';
import { getImageUrl } from '../api';
import { Bookmark, BookmarkCheck, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (e: React.MouseEvent, movie: Movie) => void;
}

export function MovieCard({ movie, onClick, isInWatchlist, onToggleWatchlist }: MovieCardProps) {
  const posterUrl = getImageUrl(movie.poster_path, 'w500');

  return (
    <motion.div
      className="group relative flex flex-col cursor-pointer transition-all"
      onClick={() => onClick(movie)}
    >
      <div className="relative aspect-[2/3] w-full rounded-2xl bg-slate-200 dark:bg-white/5 overflow-hidden mb-3 border border-slate-200 dark:border-white/5 dark:ring-1 dark:ring-white/10 group-hover:scale-[1.02] dark:group-hover:ring-[#E50914]/50 transition-all">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-slate-400 dark:text-white/20 text-xs font-bold uppercase tracking-wider">
            No Poster
          </div>
        )}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={(e) => onToggleWatchlist(e, movie)}
            className="p-1.5 rounded-full bg-white/50 hover:bg-white/80 dark:bg-black/60 dark:backdrop-blur-md dark:hover:bg-black/80 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 dark:shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          >
            {isInWatchlist ? (
              <BookmarkCheck className="w-4 h-4 text-indigo-500 dark:text-[#E50914] fill-indigo-500 dark:fill-[#E50914]" />
            ) : (
              <Bookmark className="w-4 h-4 text-slate-700 dark:text-[#E50914]" />
            )}
          </button>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 dark:opacity-100"></div>
      </div>
      
      <div className="flex flex-col px-1">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[10px] text-slate-500 dark:text-white/40">
            {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
          </span>
          <div className="flex items-center text-amber-500 font-bold text-[10px] gap-1">
            <Star className="w-3 h-3 fill-amber-500" />
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
