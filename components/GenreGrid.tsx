
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Genre } from '../types';
import { fetchAnimeGenres } from '../services/jikanApi';
import Spinner from './Spinner';

const GenreGrid: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getGenres = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAnimeGenres();
        const popularGenres = data
          .sort((a, b) => b.count - a.count)
          .slice(0, 12);
        setGenres(popularGenres);
      } catch (e) {
        setError('Could not load genres.');
      } finally {
        setLoading(false);
      }
    };
    getGenres();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-40">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }
    
    if (genres.length === 0) {
        return (
             <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">No genres found.</p>
            </div>
        );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {genres.map((genre) => (
          <Link
            key={genre.mal_id}
            to={`/genre/${genre.mal_id}?name=${encodeURIComponent(genre.name)}`}
            className="text-center p-4 bg-[#16213e] rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 font-semibold text-white hover:bg-[#e94560]"
          >
            {genre.name}
          </Link>
        ))}
      </div>
    );
  };
  
  return (
    <section className="py-8 px-5">
      <h2 className="text-2xl font-bold text-[#e94560] mb-4">Explore Genres</h2>
      {renderContent()}
    </section>
  );
};

export default GenreGrid;
