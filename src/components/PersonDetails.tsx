import React, { useEffect, useState } from 'react';
import { fetchPersonDetails, getImageUrl } from '../api';
import { X, Loader2, Calendar, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MovieCard } from './MovieCard';

interface PersonDetailsProps {
  personId: number;
  onClose: () => void;
  onMovieClick: (movie: any) => void;
}

export function PersonDetails({ personId, onClose, onMovieClick }: PersonDetailsProps) {
  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonDetails(personId).then(data => {
      setPerson(data);
      setLoading(false);
    });
  }, [personId]);

  if (!personId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl h-[90vh] overflow-y-auto bg-[#050505] rounded-[2rem] shadow-2xl border border-white/10 ring-1 ring-white/5 flex flex-col md:flex-row overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#E50914] animate-spin" />
            </div>
          ) : person ? (
            <>
              {/* Image Section */}
              <div className="w-full md:w-1/3 shrink-0 bg-white/5 relative">
                <div className="aspect-[2/3] md:aspect-auto md:h-full">
                  {person.profile_path ? (
                    <img
                      src={getImageUrl(person.profile_path, 'w500') || ''}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 font-bold uppercase tracking-widest text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#050505] hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90 md:hidden" />
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6 md:p-10 flex flex-col relative z-10 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-white uppercase tracking-tight mb-4">
                  {person.name}
                </h2>
                
                <div className="flex flex-wrap gap-4 text-sm text-white/80 font-sans mb-8">
                  {person.birthday && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#E50914]" />
                      <span>{person.birthday}</span>
                    </div>
                  )}
                  {person.place_of_birth && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#E50914]" />
                      <span>{person.place_of_birth}</span>
                    </div>
                  )}
                </div>

                <div className="mb-10">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 border-b border-white/10 pb-2">
                    Biography
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm whitespace-pre-wrap">
                    {person.biography || "No biography available."}
                  </p>
                </div>

                {person.combined_credits?.cast?.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 border-b border-white/10 pb-2">
                      Known For
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                      {person.combined_credits.cast
                        .sort((a: any, b: any) => b.vote_count - a.vote_count)
                        .slice(0, 15)
                        .map((movie: any) => (
                          <div key={movie.id} className="w-32 shrink-0 group cursor-pointer" onClick={() => onMovieClick(movie)}>
                            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-white/5">
                              {movie.poster_path ? (
                                <img src={getImageUrl(movie.poster_path, 'w500') || ''} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px] uppercase">No Poster</div>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-white truncate">{movie.title || movie.name}</h4>
                            <p className="text-[10px] text-white/40 truncate">{movie.character}</p>
                          </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/40">Failed to load person details.</div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
