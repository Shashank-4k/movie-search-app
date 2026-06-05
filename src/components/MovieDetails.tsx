import React, { useEffect, useState } from 'react';
import { Movie, WatchlistItem } from '../types';
import { fetchMovieDetailsFull, getImageUrl, fetchSimilarMovies, fetchRecommendedMovies } from '../api';
import { X, Calendar, Star, Clock, CheckCircle2, Circle, Loader2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MovieCard } from './MovieCard';
import { PersonDetails } from './PersonDetails';

interface MovieDetailsProps {
  initialMovie: Movie;
  onClose: () => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (e: React.MouseEvent, movie: Movie) => void;
  onMovieClick: (movie: Movie) => void;
}

export function MovieDetails({ initialMovie, onClose, isInWatchlist, onToggleWatchlist, onMovieClick }: MovieDetailsProps) {
  const [details, setDetails] = useState<any>(null);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    Promise.all([
      fetchMovieDetailsFull(initialMovie.id),
      fetchSimilarMovies(initialMovie.id),
      fetchRecommendedMovies(initialMovie.id)
    ]).then(([detailsData, simData, recData]) => {
      if (mounted) {
        setDetails(detailsData);
        setSimilar(simData);
        setRecommended(recData);
        setLoading(false);
      }
    });

    return () => { mounted = false; };
  }, [initialMovie.id]);

  const displayMovie = details || initialMovie;
  const cast = details?.credits?.cast?.slice(0, 15) || [];
  const crew = details?.credits?.crew || [];
  
  const director = crew.find((c: any) => c.job === 'Director');
  const writers = crew.filter((c: any) => ['Screenplay', 'Writer'].includes(c.job)).slice(0, 3);
  const producers = crew.filter((c: any) => c.job === 'Producer').slice(0, 3);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed inset-0 z-50 bg-[#050505] overflow-y-auto custom-scrollbar flex flex-col items-center"
      >
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-[60] p-3 rounded-full bg-black/40 hover:bg-[#E50914] backdrop-blur-md text-white transition-colors border border-white/10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Hero Section */}
        <div className="relative w-full max-w-[1600px] aspect-[16/9] sm:aspect-video lg:aspect-[21/9] bg-white/5 shrink-0 overflow-hidden">
          {displayMovie.backdrop_path ? (
            <img
              src={getImageUrl(displayMovie.backdrop_path, 'original') || ''}
              alt={displayMovie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 md:p-20 flex flex-col justify-end max-w-7xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-extrabold text-white tracking-tighter uppercase mb-4 leading-none drop-shadow-lg">
              {displayMovie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-sans font-bold tracking-widest text-[#E50914] uppercase mb-8 drop-shadow-md">
              {displayMovie.release_date && (
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md py-1.5 px-3 rounded-md border border-white/10">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(displayMovie.release_date).getFullYear()}</span>
                </div>
              )}
              {displayMovie.vote_average ? (
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md py-1.5 px-3 rounded-md border border-white/10">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{displayMovie.vote_average.toFixed(1)}</span>
                </div>
              ) : null}
              {details?.runtime ? (
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md py-1.5 px-3 rounded-md border border-white/10">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>
                </div>
              ) : null}
              {details?.status && (
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md py-1.5 px-3 rounded-md border border-white/10">
                  <span>{details.status}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={(e) => onToggleWatchlist(e, initialMovie)}
                className={`flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-sans font-bold uppercase tracking-wider text-xs sm:text-sm transition-all ${
                  isInWatchlist
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                    : 'bg-white hover:bg-white/90 text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                }`}
              >
                {isInWatchlist ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative z-10 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Overview & Trailer */}
            <div className="lg:col-span-2 flex flex-col gap-12">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#E50914] mb-3 border-b border-white/10 pb-2">
                  Storyline
                </h3>
                <p className="text-white/80 leading-relaxed text-lg font-sans">
                  {displayMovie.overview || "No overview available."}
                </p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {(details?.genres || displayMovie.genres)?.map((g: any) => (
                    <span key={g.id} className="px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-wider">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cast Section */}
              {cast.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#E50914] mb-3 border-b border-white/10 pb-2">
                    Top Cast
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                    {cast.map((actor: any) => (
                      <div 
                        key={actor.id} 
                        className="w-28 sm:w-32 shrink-0 group cursor-pointer snap-start"
                        onClick={() => setSelectedPersonId(actor.id)}
                      >
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-white/5 ring-1 ring-white/10">
                          {actor.profile_path ? (
                            <img src={getImageUrl(actor.profile_path, 'w500') || ''} alt={actor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px] uppercase">No Photo</div>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-white truncate leading-tight mb-1">{actor.name}</h4>
                        <p className="text-[10px] text-white/40 font-bold truncate uppercase">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              {details?.reviews?.results?.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#E50914] mb-4 border-b border-white/10 pb-2">
                    Featured Reviews
                  </h3>
                  <div className="flex flex-col gap-4">
                    {details.reviews.results.slice(0, 3).map((review: any) => (
                      <div key={review.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xs uppercase">
                            {review.author[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white uppercase tracking-wider">{review.author}</p>
                            <p className="text-[10px] text-white/40">{new Date(review.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p className="text-sm text-white/70 line-clamp-4">
                          {review.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Crew & Info */}
            <div className="flex flex-col gap-8">
              {director && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#E50914] mb-2 border-b border-white/10 pb-2">
                    Director
                  </h3>
                  <p className="text-white font-bold text-sm tracking-wide">{director.name}</p>
                </div>
              )}
              {writers.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#E50914] mb-2 border-b border-white/10 pb-2">
                    Writers
                  </h3>
                  <p className="text-white font-bold text-sm tracking-wide">{writers.map((w: any) => w.name).join(', ')}</p>
                </div>
              )}
              {producers.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#E50914] mb-2 border-b border-white/10 pb-2">
                    Producers
                  </h3>
                  <p className="text-white font-bold text-sm tracking-wide">{producers.map((w: any) => w.name).join(', ')}</p>
                </div>
              )}

              {details?.['watch/providers']?.results?.US?.flatrate && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#E50914] mb-3 border-b border-white/10 pb-2">
                    Streaming On
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {details['watch/providers'].results.US.flatrate.map((provider: any) => (
                      <div key={provider.provider_id} className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/20 hover:scale-110 transition-transform">
                        <img src={getImageUrl(provider.logo_path, 'original') || ''} alt={provider.provider_name} className="w-full h-full object-cover" title={provider.provider_name} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {details?.keywords?.keywords?.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#E50914] mb-3 border-b border-white/10 pb-2">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {details.keywords.keywords.slice(0, 15).map((kw: any) => (
                      <span key={kw.id} className="text-[10px] uppercase font-bold text-white/50 bg-white/5 hover:bg-white/10 hover:text-white transition-colors border border-white/10 px-2 py-1 rounded">
                        {kw.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar & Recommended */}
          {(similar.length > 0 || recommended.length > 0) && (
            <div className="mt-20 flex flex-col gap-12 border-t border-white/10 pt-12">
              {recommended.length > 0 && (
                <div>
                  <h3 className="text-xl font-sans font-extrabold uppercase tracking-tight text-white mb-6">
                    More Like This (Recommended)
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-8 snap-x custom-scrollbar">
                    {recommended.map(m => (
                      <div key={m.id} className="w-36 sm:w-48 shrink-0 snap-start">
                        <MovieCard 
                          movie={m}
                          onClick={() => onMovieClick(m)}
                          isInWatchlist={false}
                          onToggleWatchlist={onToggleWatchlist}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {similar.length > 0 && (
                <div>
                  <h3 className="text-xl font-sans font-extrabold uppercase tracking-tight text-white mb-6">
                    Similar Movies
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-8 snap-x custom-scrollbar">
                    {similar.map(m => (
                      <div key={m.id} className="w-36 sm:w-48 shrink-0 snap-start">
                        <MovieCard 
                          movie={m}
                          onClick={() => onMovieClick(m)}
                          isInWatchlist={false}
                          onToggleWatchlist={onToggleWatchlist}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {selectedPersonId && (
        <PersonDetails 
          personId={selectedPersonId} 
          onClose={() => setSelectedPersonId(null)} 
          onMovieClick={(m) => {
            setSelectedPersonId(null);
            onMovieClick(m);
          }}
        />
      )}
    </AnimatePresence>
  );
}
