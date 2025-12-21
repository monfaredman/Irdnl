import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import type { AxiosError, AxiosRequestConfig } from 'axios';

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

type TMDBMultiSearchResult =
  | ({ media_type: 'movie' } & TMDBMovie)
  | ({ media_type: 'tv' } & TMDBTVShow)
  | {
      media_type: 'person';
      id: number;
      name: string;
      profile_path: string | null;
      known_for_department?: string;
    };

@Injectable()
export class TMDBService {
  private readonly logger = new Logger(TMDBService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly imageBaseUrl: string;

  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly http: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
    this.baseUrl =
      this.configService.get<string>('TMDB_BASE_URL') || 'https://api.themoviedb.org/3';
    this.imageBaseUrl =
      this.configService.get<string>('TMDB_IMAGE_BASE_URL') || 'https://image.tmdb.org/t/p';

    if (!this.apiKey) {
      console.warn('TMDB_API_KEY is not set. TMDB features will not work.');
    }

    // Log proxy configuration if set
    const proxyHost = this.configService.get<string>('HTTP_PROXY') || this.configService.get<string>('HTTPS_PROXY');
    if (proxyHost) {
      this.logger.log(`Using proxy: ${proxyHost}`);
    }
  }

  private isProbablyProxyNetworkError(error: unknown): boolean {
    const err = error as AxiosError | undefined;
    const code = err?.code;
    // Common proxy/connectivity codes
    return (
      code === 'ECONNREFUSED' ||
      code === 'ETIMEDOUT' ||
      code === 'ECONNRESET' ||
      code === 'EHOSTUNREACH' ||
      code === 'ENETUNREACH'
    );
  }

  private async axiosGetWithRetry<T>(
    url: string,
    config: AxiosRequestConfig,
    retries: number,
    baseDelayMs: number,
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await firstValueFrom(this.http.get<T>(url, config));
        return response.data;
      } catch (error) {
        lastError = error;

        const axiosErr = error as AxiosError;
        const status = axiosErr.response?.status;
        const isRateLimited = status === 429;
        const isRetryableStatus = status === 429 || (typeof status === 'number' && status >= 500);
        const isNetwork = this.isProbablyProxyNetworkError(error);

        if (attempt >= retries || (!isNetwork && !isRetryableStatus)) {
          break;
        }

        // Prefer Retry-After when rate-limited
        let delayMs = Math.round(baseDelayMs * Math.pow(2, attempt));
        if (isRateLimited) {
          const retryAfter = axiosErr.response?.headers?.['retry-after'];
          const parsed = typeof retryAfter === 'string' ? parseInt(retryAfter, 10) : NaN;
          if (!Number.isNaN(parsed) && parsed > 0) {
            delayMs = parsed * 1000;
          }
        }

        await new Promise((r) => setTimeout(r, delayMs));
      }
    }

    throw lastError;
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
      throw new HttpException('TMDB API key is not configured', HttpStatus.SERVICE_UNAVAILABLE);
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.set('api_key', this.apiKey);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });

    const retries = this.configService.get<number>('TMDB_HTTP_RETRIES', 2);
    const baseDelayMs = this.configService.get<number>('TMDB_HTTP_RETRY_DELAY_MS', 300);

    try {
      const data = await this.axiosGetWithRetry<T>(
        url.toString(),
        {
          // Host-based guard: this service should only ever call TMDB
          headers: {
            Accept: 'application/json',
          },
        },
        retries,
        baseDelayMs,
      );

      if (cacheKey) {
        await this.cacheManager.set(cacheKey, data, cacheTtl);
      }

      return data;
    } catch (error) {
      // If proxy is enabled and the proxy is down, attempt a graceful fallback by bypassing proxy.
      // We do this by issuing a direct axios request using a fresh axios instance with proxy disabled.
      // NOTE: this only helps if the failure is a connectivity-type proxy error.
      const enabled = this.configService.get<string>('TMDB_PROXY_ENABLED', 'true') === 'true';
      const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
      const allowInProd =
        this.configService.get<string>('TMDB_PROXY_ALLOW_IN_PROD', 'false') === 'true';
      const shouldUseProxy = enabled && (nodeEnv !== 'production' || allowInProd);

      if (shouldUseProxy && this.isProbablyProxyNetworkError(error)) {
        const axiosErr = error as AxiosError;
        this.logger.warn(
          `TMDB proxy connection issue (${axiosErr.code || 'unknown'}). Falling back to direct TMDB request for ${endpoint}.`,
        );

        // Lazy import to avoid adding a new top-level dependency expectation
        // (axios is already installed for HttpModule)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const axios = require('axios') as typeof import('axios');

        try {
          const response = await axios.default.get<T>(url.toString(), {
            timeout: this.configService.get<number>('TMDB_HTTP_TIMEOUT_MS', 10000),
            proxy: false,
            headers: {
              Accept: 'application/json',
            },
          });

          const data = response.data;
          if (cacheKey) {
            await this.cacheManager.set(cacheKey, data, cacheTtl);
          }
          return data;
        } catch (fallbackError) {
          this.logger.error(
            `TMDB direct fallback request failed for ${endpoint}`,
            (fallbackError as Error)?.stack,
          );
          // Continue below to normalize error
          error = fallbackError;
        }
      }

      if (error instanceof HttpException) {
        throw error;
      }

      const axiosErr = error as AxiosError;
      const status = axiosErr.response?.status;

      if (status === 429) {
        throw new HttpException('TMDB API rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
      }

      if (typeof status === 'number') {
        throw new HttpException(`TMDB API error: ${status}`, status);
      }

      throw new HttpException('Failed to fetch data from TMDB', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private getImageUrl(path: string | null, size: 'w200' | 'w500' | 'original' = 'w500'): string {
    if (!path) return '';
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  async getPopularMovies(
    language: 'en' | 'fa' = 'fa',
    page: number = 1,
  ): Promise<TMDBResponse<TMDBMovie>> {
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

  async getPopularTVShows(
    language: 'en' | 'fa' = 'fa',
    page: number = 1,
  ): Promise<TMDBResponse<TMDBTVShow>> {
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

  async searchMovies(
    query: string,
    language: 'en' | 'fa' = 'fa',
  ): Promise<TMDBResponse<TMDBMovie>> {
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

  async searchTVShows(
    query: string,
    language: 'en' | 'fa' = 'fa',
  ): Promise<TMDBResponse<TMDBTVShow>> {
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

  async searchMulti(
    query: string,
    options: {
      language?: 'en' | 'fa';
      page?: number;
      includeAdult?: boolean;
    } = {},
  ): Promise<TMDBResponse<TMDBMultiSearchResult>> {
    const { language = 'fa', page = 1, includeAdult = false } = options;
    const cacheKey = `tmdb:search_multi:${query}:${language}:${page}:${includeAdult}`;

    return this.fetchFromTMDB<TMDBResponse<TMDBMultiSearchResult>>(
      '/search/multi',
      {
        query,
        page,
        include_adult: includeAdult ? 'true' : 'false',
        language: language === 'fa' ? 'fa-IR' : 'en-US',
      },
      cacheKey,
      1800,
    );
  }

  async discoverMovies(
    language: 'en' | 'fa' = 'fa',
    options: {
      genre?: string;
      withGenres?: string;
      year?: number;
      certification?: string;
      country?: string;
      page?: number;
    } = {},
  ): Promise<TMDBResponse<TMDBMovie>> {
    const { genre, withGenres, year, certification, country, page = 1 } = options;
  const cacheKey = `tmdb:discover_movies:${language}:${withGenres || ''}:${genre}:${year}:${certification}:${country}:${page}`;
    
    const params: any = {
      language: language === 'fa' ? 'fa-IR' : 'en-US',
      page,
      sort_by: 'popularity.desc',
    };
    
    if (withGenres) {
      params.with_genres = withGenres;
    } else if (genre && genre !== 'all') {
      // Map genre names to TMDB genre IDs
      const genreMap: Record<string, number> = {
        action: 28,
        adventure: 12,
        animation: 16,
        comedy: 35,
        crime: 80,
        documentary: 99,
        drama: 18,
        family: 10751,
        fantasy: 14,
        history: 36,
        horror: 27,
        music: 10402,
        mystery: 9648,
        romance: 10749,
        'science fiction': 878,
        thriller: 53,
        war: 10752,
        western: 37,
      };
      
      const genreId = genreMap[genre.toLowerCase()];
      if (genreId) {
        params.with_genres = genreId;
      }
    }
    
    if (year) {
      params.primary_release_year = year;
    }
    
    // Map age ratings to TMDB certifications
    if (certification && certification !== 'all') {
      const certMap: Record<string, string> = {
        g: 'G',
        pg: 'PG',
        pg13: 'PG-13',
        r: 'R',
        nc17: 'NC-17',
      };
      const cert = certMap[certification.toLowerCase()];
      if (cert) {
        params.certification_country = 'US';
        params.certification = cert;
      }
    }
    
    // Map country codes
    if (country && country !== 'all') {
      const countryMap: Record<string, string> = {
        us: 'US',
        usa: 'US',
        uk: 'GB',
        iran: 'IR',
        ir: 'IR',
        france: 'FR',
        fr: 'FR',
        germany: 'DE',
        de: 'DE',
        japan: 'JP',
        jp: 'JP',
        korea: 'KR',
        kr: 'KR',
      };
      const countryCode = countryMap[country.toLowerCase()] || country.toUpperCase();
      params.with_origin_country = countryCode;
    }
    
    return this.fetchFromTMDB<TMDBResponse<TMDBMovie>>(
      '/discover/movie',
      params,
      cacheKey,
      3600, // 1 hour for discover results
    );
  }

  async discoverTVShows(
    language: 'en' | 'fa' = 'fa',
    options: {
      genre?: string;
      withGenres?: string;
      year?: number;
      certification?: string;
      country?: string;
      page?: number;
    } = {},
  ): Promise<TMDBResponse<TMDBTVShow>> {
    const { genre, withGenres, year, certification, country, page = 1 } = options;
  const cacheKey = `tmdb:discover_tv:${language}:${withGenres || ''}:${genre}:${year}:${certification}:${country}:${page}`;
    
    const params: any = {
      language: language === 'fa' ? 'fa-IR' : 'en-US',
      page,
      sort_by: 'popularity.desc',
    };
    
    if (withGenres) {
      params.with_genres = withGenres;
    } else if (genre && genre !== 'all') {
      // Map genre names to TMDB genre IDs (TV genres)
      const genreMap: Record<string, number> = {
        action: 10759,
        adventure: 10759,
        animation: 16,
        comedy: 35,
        crime: 80,
        documentary: 99,
        drama: 18,
        family: 10751,
        fantasy: 10765,
        history: 36,
        horror: 9648,
        kids: 10762,
        mystery: 9648,
        news: 10763,
        reality: 10764,
        'science fiction': 10765,
        thriller: 9648,
        war: 10768,
        western: 37,
      };
      
      const genreId = genreMap[genre.toLowerCase()];
      if (genreId) {
        params.with_genres = genreId;
      }
    }
    
    if (year) {
      params.first_air_date_year = year;
    }
    
    // TV content ratings (less straightforward than movies)
    if (certification && certification !== 'all') {
      const certMap: Record<string, string> = {
        g: 'TV-G',
        pg: 'TV-PG',
        pg13: 'TV-14',
        r: 'TV-MA',
      };
      const cert = certMap[certification.toLowerCase()];
      if (cert) {
        params.certification_country = 'US';
        params.certification = cert;
      }
    }
    
    // Map country codes
    if (country && country !== 'all') {
      const countryMap: Record<string, string> = {
        us: 'US',
        usa: 'US',
        uk: 'GB',
        iran: 'IR',
        ir: 'IR',
        france: 'FR',
        fr: 'FR',
        germany: 'DE',
        de: 'DE',
        japan: 'JP',
        jp: 'JP',
        korea: 'KR',
        kr: 'KR',
      };
      const countryCode = countryMap[country.toLowerCase()] || country.toUpperCase();
      params.with_origin_country = countryCode;
    }
    
    return this.fetchFromTMDB<TMDBResponse<TMDBTVShow>>(
      '/discover/tv',
      params,
      cacheKey,
      3600, // 1 hour for discover results
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
      origin:
        tmdbMovie.original_language === 'fa' || tmdbMovie.original_language === 'ar'
          ? 'iranian'
          : 'foreign',
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
      origin:
        tmdbShow.origin_country.includes('IR') || tmdbShow.original_language === 'fa'
          ? 'iranian'
          : 'foreign',
      cast: [],
      tags: [],
      seasons: [],
      ongoing: true,
    };
  }
}
