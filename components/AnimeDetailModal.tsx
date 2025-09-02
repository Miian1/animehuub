
import React, { useState, useEffect } from 'react';
import { Anime, AnimeDetails, StreamingService } from '../types';
import { fetchAnimeDetails, fetchAnimeStreaming } from '../services/jikanApi';
import Spinner from './Spinner';

interface AnimeDetailModalProps {
  anime: Anime | null;
  onClose: () => void;
}

const AnimeDetailModal: React.FC<AnimeDetailModalProps> = ({ anime, onClose }) => {
  const [details, setDetails] = useState<AnimeDetails | null>(null);
  const [streaming, setStreaming] = useState<StreamingService[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (anime) {
      setLoading(true);
      setDetails(null);
      setStreaming([]);
      const getDetailsAndStreaming = async () => {
        const detailsPromise = fetchAnimeDetails(anime.mal_id);
        const streamingPromise = fetchAnimeStreaming(anime.mal_id);
        
        const [detailsData, streamingData] = await Promise.all([
          detailsPromise,
          streamingPromise
        ]);

        setDetails(detailsData);
        setStreaming(streamingData);
        setLoading(false);
      };
      getDetailsAndStreaming();
    }
  }, [anime]);

  if (!anime) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-[#16213e] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl z-10">&times;</button>
        {loading ? (
          <div className="h-96 flex justify-center items-center"><Spinner /></div>
        ) : !details ? (
          <div className="h-96 flex justify-center items-center"><p>Could not load details.</p></div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 p-8">
            <div className="flex-shrink-0 w-full md:w-1/3">
              <img src={details.images.jpg.large_image_url} alt={details.title} className="rounded-lg w-full" />
            </div>
            <div className="flex-grow">
              <h2 className="text-3xl font-bold text-[#e94560] mb-2">{details.title}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400 mb-4">
                <span>{details.type} • {details.episodes || '?'} eps</span>
                <span className="flex items-center gap-1 text-yellow-400"><i className="fas fa-star"></i>{details.score || 'N/A'}</span>
                <span>{details.status}</span>
              </div>
              <p className="text-sm leading-relaxed mb-6 max-h-40 overflow-y-auto">{details.synopsis}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm mb-6">
                  <div><strong className="text-gray-400">Aired:</strong> {details.aired?.string || 'N/A'}</div>
                  <div><strong className="text-gray-400">Premiered:</strong> {details.season && details.year ? `${details.season} ${details.year}` : 'N/A'}</div>
                  <div><strong className="text-gray-400">Studios:</strong> {details.studios?.map(s => s.name).join(', ') || 'N/A'}</div>
                  <div><strong className="text-gray-400">Genres:</strong> {details.genres?.map(g => g.name).join(', ') || 'N/A'}</div>
                  <div><strong className="text-gray-400">Duration:</strong> {details.duration || 'N/A'}</div>
                  <div><strong className="text-gray-400">Rating:</strong> {details.rating || 'N/A'}</div>
              </div>
              
              {details.trailer?.embed_url && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Trailer</h3>
                  <iframe
                    src={details.trailer.embed_url}
                    className="w-full aspect-video rounded-lg"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {streaming.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Watch On</h3>
                  <div className="flex flex-wrap gap-3">
                    {streaming.map((service) => (
                      <a
                        key={service.name}
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#1a1a2e] border border-[#e94560] text-white font-semibold rounded-full text-sm hover:bg-[#e94560] transition-colors"
                      >
                        {service.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeDetailModal;
