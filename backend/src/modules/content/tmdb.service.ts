import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  adult: boolean;
}

interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  origin_country: string[];
}

interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

@Injectable()
export class TMDBService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly imageBaseUrl: string;

  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
    this.baseUrl = this.configService.get<string>('TMDB_BASE_URL') || 'https://api.themoviedb.org/3';
    this.imageBaseUrl = this.configService.get<string>('TMDB_IMAGE_BASE_URL') || 'https://image.tmdb.org/t/p';

    if (!this.apiKey) {
      console.warn('TMDB_API_KEY is not set. TMDB features will not work.');
    }
  }

  private async fetchFromTMDB<T>(
    endpoint: string,
    params: Record<string, string | number> = {},
    cacheKey?: string,
    cacheTtl: number = 3600, // 1 hour default
  ): Promise<T> {
    // Check cache first
    if (cacheKey) {
      const cached = await this.cacheManager.get<T>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    if (!this.apiKey) {
      throw new HttpException(
        'TMDB API key is not configured',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.set('api_key', this.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        if (response.status === 429) {
          throw new HttpException(
            'TMDB API rate limit exceeded',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
        throw new HttpException(
          `TMDB API error: ${response.status}`,
          response.status,
        );
      }

      const data = await response.json();

      // Cache the result
      if (cacheKey) {
        await this.cacheManager.set(cacheKey, data, cacheTtl);
      }

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch data from TMDB',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getImageUrl(path: string | null, size: 'w200' | 'w500' | 'original' = 'w500'): string {
    if (!path) return '';
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  async getPopularMovies(language: 'en' | 'fa' = 'en', page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    const cacheKey = `tmdb:popular_movies:${language}:${page}`;
    return this.fetchFromTMDB<TMDBResponse<TMDBMovie>>(
      '/movie/popular',
      {
        language: language === 'fa' ? 'fa-IR' : 'en-US',
        page,
      },
      cacheKey,
    );
  }

  async getTrendingMovies(language: 'en' | 'fa' = 'en'): Promise<TMDBResponse<TMDBMovie>> {
    const cacheKey = `tmdb:trending_movies:${language}`;
    return this.fetchFromTMDB<TMDBResponse<TMDBMovie>>(
      '/trending/movie/week',
      {
        language: language === 'fa' ? 'fa-IR' : 'en-US',
      },
      cacheKey,
    );
  }

  async getPopularTVShows(language: 'en' | 'fa' = 'en', page: number = 1): Promise<TMDBResponse<TMDBTVShow>> {
    const cacheKey = `tmdb:popular_tv:${language}:${page}`;
    return this.fetchFromTMDB<TMDBResponse<TMDBTVShow>>(
      '/tv/popular',
      {
        language: language === 'fa' ? 'fa-IR' : 'en-US',
        page,
      },
      cacheKey,
    );
  }

  async searchMovies(query: string, language: 'en' | 'fa' = 'en'): Promise<TMDBResponse<TMDBMovie>> {
    const cacheKey = `tmdb:search_movies:${query}:${language}`;
    return this.fetchFromTMDB<TMDBResponse<TMDBMovie>>(
      '/search/movie',
      {
        query,
        language: language === 'fa' ? 'fa-IR' : 'en-US',
      },
      cacheKey,
      1800, // 30 minutes for search results
    );
  }

  async searchTVShows(query: string, language: 'en' | 'fa' = 'en'): Promise<TMDBResponse<TMDBTVShow>> {
    const cacheKey = `tmdb:search_tv:${query}:${language}`;
    return this.fetchFromTMDB<TMDBResponse<TMDBTVShow>>(
      '/search/tv',
      {
        query,
        language: language === 'fa' ? 'fa-IR' : 'en-US',
      },
      cacheKey,
      1800, // 30 minutes for search results
    );
  }

  // Transform TMDB movie to our Movie format
  transformMovie(tmdbMovie: TMDBMovie) {
    return {
      id: String(tmdbMovie.id),
      title: tmdbMovie.title,
      slug: tmdbMovie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: tmdbMovie.overview || 'No description available.',
      poster: this.getImageUrl(tmdbMovie.poster_path, 'w500'),
      backdrop: this.getImageUrl(tmdbMovie.backdrop_path, 'original'),
      year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : 2024,
      rating: Math.round(tmdbMovie.vote_average * 10) / 10,
      duration: 120, // TMDB doesn't provide this in list endpoints
      genres: ['drama'], // Map genre_ids to actual genres if needed
      languages: [tmdbMovie.original_language === 'fa' ? 'fa' : 'en'],
      origin: tmdbMovie.original_language === 'fa' || tmdbMovie.original_language === 'ar' ? 'iranian' : 'foreign',
      cast: [],
      tags: [],
      sources: [],
      downloads: [],
      subtitles: [
        {
          id: 'en-1',
          language: 'en',
          label: 'English',
          url: '#',
        },
        {
          id: 'fa-1',
          language: 'fa',
          label: 'Persian',
          url: '#',
        },
      ],
    };
  }

  // Transform TMDB TV show to our Series format
  transformTVShow(tmdbShow: TMDBTVShow) {
    return {
      id: String(tmdbShow.id),
      title: tmdbShow.name,
      slug: tmdbShow.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: tmdbShow.overview || 'No description available.',
      poster: this.getImageUrl(tmdbShow.poster_path, 'w500'),
      backdrop: this.getImageUrl(tmdbShow.backdrop_path, 'original'),
      year: tmdbShow.first_air_date ? new Date(tmdbShow.first_air_date).getFullYear() : 2024,
      rating: Math.round(tmdbShow.vote_average * 10) / 10,
      genres: ['drama'],
      languages: [tmdbShow.original_language === 'fa' ? 'fa' : 'en'],
      origin: tmdbShow.origin_country.includes('IR') || tmdbShow.original_language === 'fa' ? 'iranian' : 'foreign',
      cast: [],
      tags: [],
      seasons: [],
      ongoing: true,
    };
  }
}

