
import { Anime, AnimeDetails, JikanPaginatedResponse, StreamingService, Genre, ScheduleEntry, NewsArticle, Review } from '../types';

const API_BASE_URL = 'https://api.jikan.moe/v4';

interface JikanResponse<T> {
  data: T;
}

export const fetchAnimeData = async (endpoint: string, limit?: number): Promise<Anime[]> => {
  try {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (limit) {
      url.searchParams.set('limit', limit.toString());
    }
    url.searchParams.set('sfw', 'true');
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.statusText}`);
    }
    const data: JikanResponse<Anime[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching anime list:', error);
    return [];
  }
};

export const fetchAnimeDetails = async (id: number): Promise<AnimeDetails | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/anime/${id}`);
     if (!response.ok) {
      throw new Error(`Jikan API error: ${response.statusText}`);
    }
    const data: JikanResponse<AnimeDetails> = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching details for anime ID ${id}:`, error);
    return null;
  }
};

export const fetchPaginatedAnimeData = async (endpoint: string, page: number, limit: number = 16): Promise<JikanPaginatedResponse<Anime> | null> => {
  try {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('limit', limit.toString());
    url.searchParams.set('sfw', 'true');

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.statusText}`);
    }
    const data: JikanPaginatedResponse<Anime> = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching paginated anime list:', error);
    return null;
  }
};

export const searchAnime = async (query: string, page: number = 1, limit: number = 16): Promise<JikanPaginatedResponse<Anime> | null> => {
  if (!query) return null;
  try {
    const url = new URL(`${API_BASE_URL}/anime`);
    url.searchParams.set('q', query);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('limit', limit.toString());
    url.searchParams.set('sfw', 'true');

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.statusText}`);
    }
    const data: JikanPaginatedResponse<Anime> = await response.json();
    return data;
  } catch (error) {
    console.error(`Error searching anime with query "${query}":`, error);
    return null;
  }
};

export const fetchAnimeStreaming = async (id: number): Promise<StreamingService[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/anime/${id}/streaming`);
    if (!response.ok) {
      if (response.status === 404) {
          return []; // Not an error, just no streaming info available.
      }
      throw new Error(`Jikan API error: ${response.statusText}`);
    }
    const data: JikanResponse<StreamingService[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching streaming info for anime ID ${id}:`, error);
    return [];
  }
};

export const fetchAnimeGenres = async (): Promise<Genre[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/genres/anime`);
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.statusText}`);
    }
    const data: JikanResponse<Genre[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching anime genres:', error);
    return [];
  }
};

export const fetchRecentEpisodes = async (page: number = 1): Promise<JikanPaginatedResponse<ScheduleEntry> | null> => {
    try {
        const url = new URL(`${API_BASE_URL}/watch/episodes`);
        url.searchParams.set('page', page.toString());
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`Jikan API error: ${response.statusText}`);
        }
        const data: JikanPaginatedResponse<ScheduleEntry> = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching recent episodes:', error);
        return null;
    }
};

export const fetchAnimeNews = async (id: number, page: number = 1): Promise<JikanPaginatedResponse<NewsArticle> | null> => {
    try {
        const url = new URL(`${API_BASE_URL}/anime/${id}/news`);
        url.searchParams.set('page', page.toString());
        const response = await fetch(url.toString());
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Jikan API error: ${response.statusText}`);
        }
        const data: JikanPaginatedResponse<NewsArticle> = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching news for anime ID ${id}:`, error);
        return null;
    }
}

export const fetchTopReviews = async (page: number = 1): Promise<JikanPaginatedResponse<Review> | null> => {
    try {
        const url = new URL(`${API_BASE_URL}/top/reviews`);
        url.searchParams.set('page', page.toString());
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`Jikan API error: ${response.statusText}`);
        }
        const data: JikanPaginatedResponse<Review> = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching top reviews:', error);
        return null;
    }
}

export const fetchRecentReviews = async (page: number = 1): Promise<JikanPaginatedResponse<Review> | null> => {
    try {
        const url = new URL(`${API_BASE_URL}/reviews/anime`);
        url.searchParams.set('page', page.toString());
        url.searchParams.set('preliminary', 'false');
        url.searchParams.set('spoilers', 'false');
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`Jikan API error: ${response.statusText}`);
        }
        const data: JikanPaginatedResponse<Review> = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching recent reviews:', error);
        return null;
    }
}
