import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ContentService } from './content.service';
import { Content, ContentType, ContentStatus } from './entities/content.entity';
import { Series } from './entities/series.entity';
import { Season } from './entities/season.entity';
import { Episode } from './entities/episode.entity';
import { VideoAsset, VideoAssetStatus } from '../video-assets/entities/video-asset.entity';

describe('ContentService', () => {
  let service: ContentService;
  let contentRepository: any;
  let cacheManager: any;

  const mockContent: Content = {
    id: '123',
    title: 'Test Movie',
    type: ContentType.MOVIE,
    year: 2023,
    description: 'Test description',
    posterUrl: '/poster.jpg',
    bannerUrl: '/banner.jpg',
    rating: 8.5,
    status: ContentStatus.PUBLISHED,
    licenseInfo: null,
    externalPlayerUrl: null,
    seo: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    series: null,
    videoAssets: [],
    watchHistory: [],
    watchlist: [],
  };

  beforeEach(async () => {
    const mockRepository = {
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockContent], 1]),
      })),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: getRepositoryToken(Content),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Series),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(Season),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Episode),
          useValue: {},
        },
        {
          provide: getRepositoryToken(VideoAsset),
          useValue: { find: jest.fn() },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    contentRepository = module.get(getRepositoryToken(Content));
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated content', async () => {
      const query = { page: 1, limit: 20 };
      const result = await service.findAll(query, false);

      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
    });
  });

  describe('findOne', () => {
    it('should return content by id', async () => {
      (cacheManager.get as jest.Mock).mockResolvedValue(null);
      (contentRepository.findOne as jest.Mock).mockResolvedValue(mockContent);

      const result = await service.findOne('123', false);

      expect(result).toEqual(mockContent);
      expect(cacheManager.set).toHaveBeenCalled();
    });

    it('should throw NotFoundException if content not found', async () => {
      (cacheManager.get as jest.Mock).mockResolvedValue(null);
      (contentRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('999', false)).rejects.toThrow();
    });
  });
});
