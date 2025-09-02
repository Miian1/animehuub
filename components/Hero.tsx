
import React, { useState, useEffect, useCallback } from 'react';
import { Anime } from '../types';
import { fetchAnimeData } from '../services/jikanApi';
import Spinner from './Spinner';

interface HeroProps {
  onViewDetails: (anime: Anime) => void;
}

const Hero: React.FC<HeroProps> = ({ onViewDetails }) => {
  const [slides, setSlides] = useState<Anime[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTopAnime = async () => {
      setLoading(true);
      const data = await fetchAnimeData('/top/anime?limit=5');
      setSlides(data);
      setLoading(false);
    };
    getTopAnime();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length > 0) {
      const slideInterval = setInterval(nextSlide, 7000);
      return () => clearInterval(slideInterval);
    }
  }, [slides, nextSlide]);
  
  const goToSlide = (index: number) => {
      setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center bg-gray-900">
        <Spinner />
      </div>
    );
  }

  if (slides.length === 0) {
    return <div className="h-[80vh] flex items-center justify-center bg-gray-900"><p>Could not load featured anime.</p></div>;
  }

  return (
    <section className="h-[80vh] relative overflow-hidden">
      <div className="w-full h-full flex transition-transform duration-1000 ease-in-out"
           style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((anime) => (
          <div key={anime.mal_id} className="w-full h-full flex-shrink-0 relative">
            <img
              src={anime.images.jpg.large_image_url}
              alt={anime.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-10 md:bottom-20 left-5 md:left-20 max-w-lg p-5 bg-black/50 rounded-lg">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#e94560]">{anime.title}</h2>
              <p className="text-sm md:text-base mb-6 line-clamp-3">
                {anime.synopsis || 'No description available.'}
              </p>
              <button
                onClick={() => onViewDetails(anime)}
                className="px-6 py-3 bg-[#e94560] text-white font-bold rounded hover:bg-opacity-80 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index ? 'bg-[#e94560]' : 'bg-white/50'
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
