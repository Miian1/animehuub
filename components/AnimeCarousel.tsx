
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Anime } from '../types';
import { fetchAnimeData } from '../services/jikanApi';
import AnimeCard from './AnimeCard';
import Spinner from './Spinner';

interface AnimeCarouselProps {
  title: string;
  endpoint: string;
  onCardClick: (anime: Anime) => void;
}

const AnimeCarousel: React.FC<AnimeCarouselProps> = ({ title, endpoint, onCardClick }) => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px 0px 200px 0px', // Pre-load content when it's 200px away from viewport
      }
    );

    const currentRef = carouselRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!isIntersecting) return;

    const getData = async () => {
      setLoading(true);
      const data = await fetchAnimeData(endpoint, 15);
      setAnimeList(data);
      setLoading(false);
    };
    getData();
  }, [endpoint, isIntersecting]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-8 px-5" ref={carouselRef}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#e94560]">{title}</h2>
        <Link to={`/browse?title=${encodeURIComponent(title)}&endpoint=${encodeURIComponent(endpoint)}`} className="text-sm text-gray-400 hover:text-[#e94560]">
          See More <i className="fas fa-chevron-right ml-1"></i>
        </Link>
      </div>
      <div className="relative">
        {loading ? (
          <div className="h-80 flex justify-center items-center">
            <Spinner />
          </div>
        ) : animeList.length > 0 ? (
          <>
            <button 
                onClick={() => scroll('left')} 
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-[#e94560] rounded-full w-10 h-10 flex items-center justify-center transition-colors text-white -ml-4"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <div
              ref={scrollContainerRef}
              className="card-grid flex gap-4 overflow-x-auto py-4 scroll-smooth"
            >
              {animeList.map((anime) => (
                <div key={anime.mal_id} className="flex-shrink-0 w-40 sm:w-48">
                    <AnimeCard anime={anime} onClick={() => onCardClick(anime)} />
                </div>
              ))}
            </div>
            <button 
                onClick={() => scroll('right')} 
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-[#e94560] rounded-full w-10 h-10 flex items-center justify-center transition-colors text-white -mr-4"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </>
        ) : (
           <div className="h-80 flex justify-center items-center text-gray-500">
            <p>Could not load anime for this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AnimeCarousel;
