import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { fetchPaginatedAnimeData } from '../services/jikanApi';
import { Anime, PaginationInfo } from '../types';
import AnimeCard from '../components/AnimeCard';
import Spinner from '../components/Spinner';
import AnimeDetailModal from '../components/AnimeDetailModal';

const GenrePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  const genreName = searchParams.get('name') || 'Genre';
  const endpoint = `/anime?genres=${id}`;

  useEffect(() => {
    setPage(1);
  }, [id]);

  useEffect(() => {
    if (!id) {
      setError('No genre specified.');
      setLoading(false);
      return;
    }

    const getAnime = async () => {
      setLoading(true);
      setError(null);
      const result = await fetchPaginatedAnimeData(endpoint, page, 16);
      if (result) {
        setAnimeList(result.data);
        setPagination(result.pagination);
      } else {
        setError('Failed to fetch anime data for this genre. Please try again later.');
        setAnimeList([]);
        setPagination(null);
      }
      setLoading(false);
      window.scrollTo(0, 0);
    };

    getAnime();
  }, [id, endpoint, page]);

  const handleCardClick = (anime: Anime) => {
    setSelectedAnime(anime);
  };

  const handleCloseModal = () => {
    setSelectedAnime(null);
  };

  const handleNextPage = () => {
    if (pagination?.has_next_page) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-[60vh]"><Spinner /></div>;
    }
    if (error) {
      return <div className="flex justify-center items-center h-[60vh]"><p className="text-red-500">{error}</p></div>;
    }
    if (animeList.length === 0) {
      return <div className="flex justify-center items-center h-[60vh]"><p className="text-gray-400">No anime found for this genre.</p></div>;
    }
    return (
      <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-5">
          {animeList.map(anime => (
            <AnimeCard key={anime.mal_id} anime={anime} onClick={() => handleCardClick(anime)} />
          ))}
        </div>
        {pagination && (pagination.has_next_page || page > 1) && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="w-12 h-12 flex items-center justify-center bg-[#e94560] text-white rounded-full disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-opacity-80 transition-colors"
              aria-label="Previous Page"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="text-lg font-bold mx-4">{page}</span>
            <button
              onClick={handleNextPage}
              disabled={!pagination?.has_next_page}
              className="w-12 h-12 flex items-center justify-center bg-[#e94560] text-white rounded-full disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-opacity-80 transition-colors"
              aria-label="Next Page"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-block mb-4 text-gray-400 hover:text-[#e94560] transition-colors">
        <i className="fas fa-chevron-left mr-2"></i>Back to Home
      </Link>
      <h1 className="text-3xl font-bold text-[#e94560] mb-8">{decodeURIComponent(genreName)} Anime</h1>
      {renderContent()}
      {selectedAnime && <AnimeDetailModal anime={selectedAnime} onClose={handleCloseModal} />}
    </div>
  );
};

export default GenrePage;
