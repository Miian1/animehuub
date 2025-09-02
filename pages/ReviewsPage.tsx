
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchTopReviews, fetchRecentReviews } from '../services/jikanApi';
import { Review, PaginationInfo } from '../types';
import Spinner from '../components/Spinner';

type Tab = 'top' | 'recent';

const ReviewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('top');
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchReviews = useCallback(async (currentTab: Tab, currentPage: number) => {
    setLoading(true);
    setError(null);
    const fetcher = currentTab === 'top' ? fetchTopReviews : fetchRecentReviews;
    const result = await fetcher(currentPage);
    
    if (result) {
      setReviews(result.data);
      setPagination(result.pagination);
    } else {
      setError(`Failed to fetch ${currentTab} reviews.`);
      setReviews([]);
      setPagination(null);
    }
    setLoading(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setPage(1);
    fetchReviews(activeTab, 1);
  }, [activeTab, fetchReviews]);
  
  useEffect(() => {
    fetchReviews(activeTab, page);
  }, [page, activeTab, fetchReviews]);

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
    if (reviews.length === 0) {
      return <div className="flex justify-center items-center h-[60vh]"><p className="text-gray-400">No reviews found.</p></div>;
    }
    return (
      <>
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.mal_id} className="p-6 bg-[#16213e] rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0 text-center">
                        <img src={review.entry.images.jpg.large_image_url} alt={review.entry.title} className="w-32 mx-auto rounded-md mb-2"/>
                        <h3 className="font-bold text-white text-md truncate">{review.entry.title}</h3>
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                           <div>
                                <div className="flex items-center gap-2">
                                    <img src={review.user.images.jpg.image_url} alt={review.user.username} className="w-8 h-8 rounded-full" />
                                    <span className="font-semibold text-gray-300">{review.user.username}</span>
                                </div>
                                <span className="text-xs text-gray-500 mt-1 block">{new Date(review.date).toLocaleDateString()}</span>
                           </div>
                           <div className="flex items-center gap-2 text-xl font-bold text-yellow-400 bg-black/20 px-3 py-1 rounded-lg">
                                <i className="fas fa-star"></i>
                                <span>{review.score}</span>
                           </div>
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-6 leading-relaxed">{review.review}</p>
                        <a href={review.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#e94560] hover:underline mt-3 inline-block">Read full review...</a>
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
      <h1 className="text-3xl font-bold text-[#e94560] mb-4">Anime Reviews</h1>
      <div className="mb-8 flex border-b border-gray-700">
        <button onClick={() => setActiveTab('top')} className={`px-6 py-3 text-lg font-semibold transition-colors ${activeTab === 'top' ? 'text-[#e94560] border-b-2 border-[#e94560]' : 'text-gray-400'}`}>Top Reviews</button>
        <button onClick={() => setActiveTab('recent')} className={`px-6 py-3 text-lg font-semibold transition-colors ${activeTab === 'recent' ? 'text-[#e94560] border-b-2 border-[#e94560]' : 'text-gray-400'}`}>Recent Reviews</button>
      </div>
      {renderContent()}
    </div>
  );
};

export default ReviewsPage;
