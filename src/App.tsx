import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { MovieCard } from './components/MovieCard';
import { MovieRow } from './components/MovieRow';
import { MovieDetails } from './components/MovieDetails';
import { GenreNav, GENRES } from './components/GenreNav';
import { useWatchlist } from './hooks/useWatchlist';
import { useDarkMode } from './hooks/useDarkMode';
import { fetchTrendingMovies, fetchTopRatedMovies, fetchMoviesByGenre, searchMovies } from './api';
import { Movie } from './types';
import { Loader2, Library, SearchX, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { isDark, toggleDark } = useDarkMode();
  const { watchlist, toggleWatchlist, toggleWatched, isInWatchlist } = useWatchlist();
  
  const [currentView, setCurrentView] = useState<'home' | 'watchlist'>('home');
  const [gridMovies, setGridMovies] = useState<Movie[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [watchlistFilter, setWatchlistFilter] = useState<'all' | 'unwatched' | 'watched'>('all');

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setGridMovies([]);
      return;
    }
    
    setSelectedGenreId(null);
    setLoading(true);
    setError('');
    try {
      const results = await searchMovies(query);
      setGridMovies(results);
    } catch (err: any) {
      setError(err.message || 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGenre = async (id: number | null) => {
    setSelectedGenreId(id);
    if (id !== null) {
      setSearchQuery('');
      setLoading(true);
      setError('');
      try {
        const results = await fetchMoviesByGenre(id);
        setGridMovies(results);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch genre movies.');
      } finally {
        setLoading(false);
      }
    } else {
      setGridMovies([]);
    }
  };

  const handleToggleWatchlist = (e: React.MouseEvent, movie: Movie) => {
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  const filteredWatchlist = watchlist.filter(m => {
    if (watchlistFilter === 'watched') return m.watched;
    if (watchlistFilter === 'unwatched') return !m.watched;
    return true;
  });

  const getGenreName = (id: number) => GENRES.find(g => g.id === id)?.name || '';

  const fetchTrending = useCallback(() => fetchTrendingMovies(), []);
  const fetchTopRated = useCallback(() => fetchTopRatedMovies(), []);
  const fetchAction = useCallback(() => fetchMoviesByGenre(28), []);
  const fetchComedy = useCallback(() => fetchMoviesByGenre(35), []);
  const fetchRomance = useCallback(() => fetchMoviesByGenre(10749), []);
  const fetchHorror = useCallback(() => fetchMoviesByGenre(27), []);
  const fetchSciFi = useCallback(() => fetchMoviesByGenre(878), []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white transition-colors duration-200 relative overflow-hidden flex flex-col font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none hidden dark:block">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#E50914] opacity-20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1a73e8] opacity-10 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen max-h-screen overflow-y-auto">
        <Header 
          searchQuery={searchQuery}
          isDark={isDark} 
          onToggleDark={toggleDark} 
          onSearch={handleSearch}
          currentView={currentView}
          onChangeView={(view) => {
            setCurrentView(view);
            if (view === 'watchlist') {
               setSelectedGenreId(null);
               setSearchQuery('');
            }
          }}
        />

        {currentView === 'home' && (
          <GenreNav 
            selectedGenreId={selectedGenreId} 
            onSelectGenre={handleSelectGenre} 
          />
        )}

        <main className="flex-1 w-full pb-12 pt-8">
          {currentView === 'home' ? (
            <>
              {error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-[#E50914]/20 text-red-600 dark:text-[#E50914] border border-red-100 dark:border-[#E50914]/30 font-medium">
                    {error}
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <Loader2 className="w-8 h-8 text-[#E50914] animate-spin" />
                </div>
              ) : searchQuery || selectedGenreId !== null ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl md:text-4xl font-sans font-extrabold tracking-tight uppercase">
                      {searchQuery ? `Search Results for "${searchQuery}"` : `${getGenreName(selectedGenreId!)} Movies`}
                    </h1>
                  </div>

                  {gridMovies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                      <AnimatePresence>
                        {gridMovies.map(movie => (
                          <MovieCard 
                            key={movie.id} 
                            movie={movie} 
                            onClick={setSelectedMovie}
                            isInWatchlist={isInWatchlist(movie.id)}
                            onToggleWatchlist={handleToggleWatchlist}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-slate-400 dark:text-white/40">
                      <SearchX className="w-16 h-16 mb-4 opacity-50" />
                      <h3 className="text-lg font-bold text-slate-600 dark:text-white">No movies found</h3>
                      <p>Try refining your search</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <MovieRow 
                    title="Trending Now" 
                    fetchFn={fetchTrending} 
                    onMovieClick={setSelectedMovie}
                    isInWatchlist={isInWatchlist}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                  <MovieRow 
                    title="Top Rated" 
                    fetchFn={fetchTopRated} 
                    onMovieClick={setSelectedMovie}
                    isInWatchlist={isInWatchlist}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                  <MovieRow 
                    title="Action Movies" 
                    fetchFn={fetchAction} 
                    onMovieClick={setSelectedMovie}
                    isInWatchlist={isInWatchlist}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                  <MovieRow 
                    title="Comedy Movies" 
                    fetchFn={fetchComedy} 
                    onMovieClick={setSelectedMovie}
                    isInWatchlist={isInWatchlist}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                  <MovieRow 
                    title="Romance Movies" 
                    fetchFn={fetchRomance} 
                    onMovieClick={setSelectedMovie}
                    isInWatchlist={isInWatchlist}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                  <MovieRow 
                    title="Horror Movies" 
                    fetchFn={fetchHorror} 
                    onMovieClick={setSelectedMovie}
                    isInWatchlist={isInWatchlist}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                  <MovieRow 
                    title="Science Fiction Movies" 
                    fetchFn={fetchSciFi} 
                    onMovieClick={setSelectedMovie}
                    isInWatchlist={isInWatchlist}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Library className="w-8 h-8 text-[#E50914]" />
                  <h1 className="text-2xl md:text-4xl font-sans font-extrabold tracking-tight uppercase">
                    Your Watchlist
                  </h1>
                </div>
                
                {watchlist.length > 0 && (
                  <div className="flex items-center gap-2 p-1 bg-slate-200/50 dark:bg-white/5 border dark:border-white/10 rounded-lg shrink-0">
                    {(['all', 'unwatched', 'watched'] as const).map(filter => (
                      <button
                        key={filter}
                        onClick={() => setWatchlistFilter(filter)}
                        className={`px-4 py-1.5 rounded-md text-[10px] sm:text-xs font-bold uppercase transition-all tracking-widest ${
                          watchlistFilter === filter 
                            ? 'bg-indigo-600 dark:bg-[#E50914] text-white shadow-sm' 
                            : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {watchlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-slate-400 dark:text-white/40 bg-white/50 dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/10 border-dashed">
                  <Library className="w-16 h-16 mb-4 opacity-50" />
                  <h3 className="text-xl font-sans font-bold text-slate-600 dark:text-white mb-2 uppercase tracking-tight">Watchlist is empty</h3>
                  <p className="text-sm">Save movies here to access their details offline later.</p>
                  <button 
                    onClick={() => setCurrentView('home')}
                    className="mt-6 px-6 py-2 rounded-full bg-slate-900 dark:bg-[#E50914] hover:bg-slate-800 dark:hover:bg-[#b80710] text-white font-bold transition-colors uppercase text-xs tracking-wider"
                  >
                    Explore Movies
                  </button>
                </div>
              ) : filteredWatchlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-slate-400 dark:text-white/40 font-bold uppercase tracking-wider text-sm">
                  <p>No titles match the filter</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  <AnimatePresence>
                    {filteredWatchlist.map(movie => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={movie.id} 
                        className="relative group"
                      >
                        <MovieCard 
                          movie={movie} 
                          onClick={setSelectedMovie}
                          isInWatchlist={true}
                          onToggleWatchlist={handleToggleWatchlist}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatched(movie.id);
                          }}
                          className={`absolute top-2 left-2 p-1.5 rounded-full backdrop-blur-md transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 ${
                            movie.watched 
                              ? 'bg-green-500/90 text-white hover:bg-green-600' 
                              : 'bg-white/50 dark:bg-black/80 hover:bg-white/80 dark:hover:bg-black text-slate-800 dark:text-white/80'
                          }`}
                          aria-label={movie.watched ? "Mark as unwatched" : "Mark as watched"}
                        >
                          {movie.watched ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {selectedMovie && (
        <MovieDetails 
          initialMovie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
          isInWatchlist={isInWatchlist(selectedMovie.id)}
          onToggleWatchlist={handleToggleWatchlist}
          onMovieClick={setSelectedMovie}
        />
      )}
    </div>
  );
}
