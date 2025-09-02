
export interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  type: string;
  score: number | null;
  synopsis: string | null;
}

export interface AnimeDetails extends Anime {
  episodes: number | null;
  status: string;
  aired: {
    string: string;
  };
  season: string | null;
  year: number | null;
  studios: { name: string }[];
  genres: { name: string }[];
  duration: string;
  rating: string;
  trailer: {
    embed_url: string | null;
  };
}

export interface PaginationInfo {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface JikanPaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface StreamingService {
  name: string;
  url: string;
}

export interface Genre {
    mal_id: number;
    name: string;
    url: string;
    count: number;
}

export interface Episode {
    mal_id: number;
    url: string;
    title: string;
    premium: boolean;
}

export interface ScheduleEntry {
    entry: Anime;
    episodes: Episode[];
    region_locked: boolean;
}

export interface NewsArticle {
    mal_id: number;
    url: string;
    title: string;
    date: string;
    author_username: string;
    author_url: string;
    forum_url: string;
    images: {
        jpg: {
            image_url: string;
        }
    };
    comments: number;
    excerpt: string;
}

export interface Reviewer {
    username: string;
    url: string;
    images: {
        jpg: {
            image_url: string;
        }
    }
}

export interface Review {
    mal_id: number;
    url: string;
    type: string;
    reactions: {
        overall: number;
        nice: number;
        love_it: number;
        funny: number;
        confusing: number;
        informative: number;
        well_written: number;
        creative: number;
    };
    date: string;
    review: string;
    score: number;
    tags: string[];
    is_spoiler: boolean;
    is_preliminary: boolean;
    episodes_watched: number | null;
    user: Reviewer;
    entry: Anime; 
}
