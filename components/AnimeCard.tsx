
import React from 'react';
import { Anime } from '../types';

interface AnimeCardProps {
  anime: Anime;
  onClick: () => void;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onClick }) => {
  return (
    <div
      className="w-full bg-[#16213e] rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={onClick}
    >
      <img
        src={anime.images.jpg.image_url}
        alt={anime.title}
        className="w-full aspect-[2/3] object-cover"
      />
      <div className="p-3">
        <h3 className="font-bold text-md truncate text-white" title={anime.title}>
          {anime.title}
        </h3>
        <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
          <span>{anime.type}</span>
          <div className="flex items-center">
            <i className="fas fa-star text-yellow-400 mr-1"></i>
            <span>{anime.score || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
