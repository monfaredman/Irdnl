import { TMDBService } from './tmdb.service';

// Minimal unit tests for pure transform helpers.
// We avoid hitting network/caching by instantiating the service with dummy deps.

describe('TMDBService transforms', () => {
  const makeService = () => {
    // TMDBService constructor signature in this repo takes (configService, cacheManager, httpService)
    // but transform methods don't rely on them. Provide dummies.
    return new (TMDBService as any)(
      { get: () => undefined } as any,
      {} as any,
      {} as any,
    ) as TMDBService;
  };

  it('transformMovie: uses empty string description when overview missing', () => {
    const service = makeService();

    const movie = service.transformMovie({
      id: 1,
      title: 'یک فیلم',
      overview: '',
      poster_path: null,
      backdrop_path: null,
      release_date: '',
      vote_average: 7.25,
      original_language: 'fa',
    } as any);

    expect(movie.description).toBe('');
    expect(movie.slug).toBeTruthy();
    expect(movie.year).toBeGreaterThan(2000);
    expect(movie.rating).toBe(7.3);
  });

  it('transformTVShow: falls back safely when name/overview missing', () => {
    const service = makeService();

    const show = service.transformTVShow({
      id: 2,
      name: '',
      overview: undefined,
      poster_path: null,
      backdrop_path: null,
      first_air_date: undefined,
      vote_average: undefined,
      original_language: 'en',
      origin_country: [],
    } as any);

    expect(show.title).toBeTruthy();
    expect(show.slug).toBeTruthy();
    expect(show.description).toBe('');
    expect(show.rating).toBe(0);
  });
});
