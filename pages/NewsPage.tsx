
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAnimeData, fetchAnimeNews } from '../services/jikanApi';
import { NewsArticle, Anime } from '../types';
import Spinner from '../components/Spinner';

const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const popularAnime = await fetchAnimeData('/top/anime?filter=bypopularity&limit=10');
        if (popularAnime.length === 0) {
            throw new Error("Could not fetch popular anime to get news for.");
        }
        
        const newsPromises = popularAnime.map(anime => fetchAnimeNews(anime.mal_id));
        const newsResults = await Promise.all(newsPromises);
        
        const allArticles = newsResults
          .flatMap(result => result?.data || [])
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
        setArticles(allArticles);

      } catch (e: any) {
        setError(e.message || 'Failed to fetch news.');
      } finally {
        setLoading(false);
      }
    };
    getNews();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-[60vh]"><Spinner /></div>;
    }
    if (error) {
      return <div className="flex justify-center items-center h-[60vh]"><p className="text-red-500">{error}</p></div>;
    }
    if (articles.length === 0) {
      return <div className="flex justify-center items-center h-[60vh]"><p className="text-gray-400">No news articles found.</p></div>;
    }
    return (
      <div className="space-y-6">
        {articles.map(article => (
          <a key={article.mal_id} href={article.url} target="_blank" rel="noopener noreferrer" className="block p-6 bg-[#16213e] rounded-lg shadow-lg hover:bg-[#1a1a2e] transition-colors duration-200">
            <div className="flex flex-col md:flex-row gap-6">
                <img src={article.images.jpg.image_url} alt={article.title} className="w-full md:w-48 h-auto object-cover rounded-md flex-shrink-0"/>
                <div>
                    <h2 className="text-xl font-bold text-white mb-2">{article.title}</h2>
                    <div className="text-xs text-gray-400 mb-3">
                        <span>{new Date(article.date).toLocaleDateString()}</span> by <span className="font-semibold text-[#e94560]">{article.author_username}</span>
                        <span className="mx-2">•</span>
                        <span>{article.comments} comments</span>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-3">{article.excerpt}</p>
                </div>
            </div>
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-block mb-4 text-gray-400 hover:text-[#e94560] transition-colors">
        <i className="fas fa-chevron-left mr-2"></i>Back to Home
      </Link>
      <h1 className="text-3xl font-bold text-[#e94560] mb-8">Latest Anime News</h1>
      {renderContent()}
    </div>
  );
};

export default NewsPage;
