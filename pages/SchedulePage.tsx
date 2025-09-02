
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecentEpisodes } from '../services/jikanApi';
import { ScheduleEntry, PaginationInfo } from '../types';
import Spinner from '../components/Spinner';
import AnimeDetailModal from '../components/AnimeDetailModal';

const SchedulePage: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedAnime, setSelectedAnime] = useState<ScheduleEntry['entry'] | null>(null);

  useEffect(() => {
    const getSchedule = async () => {
      setLoading(true);
      setError(null);
      const result = await fetchRecentEpisodes(page);
      if (result) {
        setSchedule(result.data);
        setPagination(result.pagination);
      } else {
        setError('Failed to fetch the schedule. Please try again later.');
        setSchedule([]);
        setPagination(null);
      }
      setLoading(false);
      window.scrollTo(0, 0);
    };

    getSchedule();
  }, [page]);

  const handleCardClick = (anime: ScheduleEntry['entry']) => {
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
    if (schedule.length === 0) {
      return <div className="flex justify-center items-center h-[60vh]"><p className="text-gray-400">No recent episodes found.</p></div>;
    }
    return (
      <>
        <div className="space-y-8">
            {schedule.map(item => (
                <div key={item.entry.mal_id} className="p-4 bg-[#16213e] rounded-lg shadow-lg flex flex-col md:flex-row gap-6">
                    <img 
                        src={item.entry.images.jpg.large_image_url} 
                        alt={item.entry.title} 
                        className="w-48 mx-auto md:w-40 h-auto object-cover rounded-md cursor-pointer transform hover:scale-105 transition-transform"
                        onClick={() => handleCardClick(item.entry)}
                    />
                    <div className="flex-grow">
                        <h2 
                            className="text-2xl font-bold text-white mb-2 cursor-pointer hover:text-[#e94560]"
                            onClick={() => handleCardClick(item.entry)}
                        >
                            {item.entry.title}
                        </h2>
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{item.entry.synopsis}</p>
                        <h3 className="text-lg font-semibold text-[#e94560] mb-2 border-b border-gray-700 pb-1">Recent Episodes</h3>
                        <div className="space-y-2">
                            {item.episodes.map(ep => (
                                <a key={ep.mal_id} href={ep.url} target="_blank" rel="noopener noreferrer" className="block p-2 bg-[#1a1a2e] rounded hover:bg-opacity-70 transition-colors">
                                    <p className="font-semibold text-white">{ep.title}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
        {pagination && (pagination.has_next_page || page > 1) && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button onClick={handlePrevPage} disabled={page === 1} className="w-12 h-12 flex items-center justify-center bg-[#e94560] text-white rounded-full disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-opacity-80 transition-colors" aria-label="Previous Page"><i className="fas fa-chevron-left"></i></button>
            <span className="text-lg font-bold mx-4">{page}</span>
            <button onClick={handleNextPage} disabled={!pagination?.has_next_page} className="w-12 h-12 flex items-center justify-center bg-[#e94560] text-white rounded-full disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-opacity-80 transition-colors" aria-label="Next Page"><i className="fas fa-chevron-right"></i></button>
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
      <h1 className="text-3xl font-bold text-[#e94560] mb-8">Recent Episode Releases</h1>
      {renderContent()}
      {selectedAnime && <AnimeDetailModal anime={selectedAnime} onClose={handleCloseModal} />}
    </div>
  );
};

export default SchedulePage;
