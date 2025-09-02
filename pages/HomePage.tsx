
import React, { useState } from 'react';
import Hero from '../components/Hero';
import AnimeCarousel from '../components/AnimeCarousel';
import AnimeDetailModal from '../components/AnimeDetailModal';
import { Anime } from '../types';
import GenreGrid from '../components/GenreGrid';

const HomePage: React.FC = () => {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  const handleCardClick = (anime: Anime) => {
    setSelectedAnime(anime);
  };

  const handleCloseModal = () => {
    setSelectedAnime(null);
  };

  return (
    <div>
      <Hero onViewDetails={handleCardClick} />
      <GenreGrid />
      <AnimeCarousel title="Trending Anime" endpoint="/top/anime?filter=bypopularity" onCardClick={handleCardClick} />
      <AnimeCarousel title="New Releases" endpoint="/seasons/now" onCardClick={handleCardClick} />
      <AnimeCarousel title="Top Favorited" endpoint="/top/anime?filter=favorite" onCardClick={handleCardClick} />
      <AnimeCarousel title="Anime Movies" endpoint="/top/anime?type=movie" onCardClick={handleCardClick} />

      {selectedAnime && <AnimeDetailModal anime={selectedAnime} onClose={handleCloseModal} />}
    </div>
  );
};

export default HomePage;
