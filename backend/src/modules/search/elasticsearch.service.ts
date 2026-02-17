import { Injectable, Logger, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Client } from '@elastic/elasticsearch';
import { Content, ContentStatus, ContentType } from '../content/entities/content.entity';
import {
  SearchQueryDto,
  SuggestQueryDto,
  SearchResponse,
  SearchResultItem,
  SuggestResponse,
  SuggestItem,
} from './dto/search.dto';

@Injectable()
export class ElasticsearchService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ElasticsearchService.name);
  private client: Client;
  private readonly indexName: string;
  private isConnected = false;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    const node = this.configService.get<string>('ELASTICSEARCH_NODE', 'http://localhost:9200');
    const prefix = this.configService.get<string>('ELASTICSEARCH_INDEX_PREFIX', 'irdnl');
    this.indexName = `${prefix}_content`;

    this.client = new Client({
      node,
      requestTimeout: 10000,
      maxRetries: 3,
    });
  }

  async onModuleInit() {
    try {
      await this.waitForConnection();
      await this.ensureIndex();
      this.logger.log('Elasticsearch connected and index ready');
    } catch (error) {
      this.logger.warn(`Elasticsearch not available: ${error.message}. Search will fall back to database.`);
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.close();
    }
  }

  private async waitForConnection(retries = 5, delay = 3000): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        const health = await this.client.cluster.health({ timeout: '5s' });
        if (health.status === 'red') {
          throw new Error('Cluster status is red');
        }
        this.isConnected = true;
        return;
      } catch (error) {
        if (i < retries - 1) {
          this.logger.warn(`Waiting for Elasticsearch (attempt ${i + 1}/${retries})...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    throw new Error('Could not connect to Elasticsearch');
  }

  /**
   * Create index with mappings optimized for Persian + English content search
   */
  private async ensureIndex(): Promise<void> {
    const exists = await this.client.indices.exists({ index: this.indexName });
    if (exists) {
      return;
    }

    await this.client.indices.create({
      index: this.indexName,
      body: {
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0,
          analysis: {
            analyzer: {
              persian_custom: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase', 'arabic_normalization', 'persian_normalization', 'persian_stop'],
              },
              edge_ngram_analyzer: {
                type: 'custom',
                tokenizer: 'edge_ngram_tokenizer',
                filter: ['lowercase', 'arabic_normalization', 'persian_normalization'],
              },
              search_analyzer: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase', 'arabic_normalization', 'persian_normalization'],
              },
            },
            tokenizer: {
              edge_ngram_tokenizer: {
                type: 'edge_ngram',
                min_gram: 2,
                max_gram: 15,
                token_chars: ['letter', 'digit'],
              },
            },
            filter: {
              persian_stop: {
                type: 'stop',
                stopwords: '_arabic_',
              },
            },
          },
        },
        mappings: {
          properties: {
            // Main searchable fields
            title: {
              type: 'text',
              analyzer: 'persian_custom',
              search_analyzer: 'search_analyzer',
              fields: {
                exact: { type: 'keyword' },
                autocomplete: {
                  type: 'text',
                  analyzer: 'edge_ngram_analyzer',
                  search_analyzer: 'search_analyzer',
                },
              },
            },
            originalTitle: {
              type: 'text',
              analyzer: 'standard',
              fields: {
                exact: { type: 'keyword' },
                autocomplete: {
                  type: 'text',
                  analyzer: 'edge_ngram_analyzer',
                  search_analyzer: 'standard',
                },
              },
            },
            description: {
              type: 'text',
              analyzer: 'persian_custom',
              search_analyzer: 'search_analyzer',
            },
            shortDescription: {
              type: 'text',
              analyzer: 'persian_custom',
              search_analyzer: 'search_analyzer',
            },
            tagline: {
              type: 'text',
              analyzer: 'persian_custom',
            },

            // Localized content
            'localizedTitle_fa': {
              type: 'text',
              analyzer: 'persian_custom',
              search_analyzer: 'search_analyzer',
              fields: {
                autocomplete: {
                  type: 'text',
                  analyzer: 'edge_ngram_analyzer',
                  search_analyzer: 'search_analyzer',
                },
              },
            },
            'localizedTitle_en': {
              type: 'text',
              analyzer: 'standard',
              fields: {
                autocomplete: {
                  type: 'text',
                  analyzer: 'edge_ngram_analyzer',
                  search_analyzer: 'standard',
                },
              },
            },
            'localizedDescription_fa': {
              type: 'text',
              analyzer: 'persian_custom',
            },
            'localizedDescription_en': {
              type: 'text',
              analyzer: 'standard',
            },

            // Filterable fields
            type: { type: 'keyword' },
            status: { type: 'keyword' },
            accessType: { type: 'keyword' },
            genres: { type: 'keyword' },
            tags: { type: 'keyword' },
            director: {
              type: 'text',
              analyzer: 'standard',
              fields: { keyword: { type: 'keyword' } },
            },
            castNames: {
              type: 'text',
              analyzer: 'standard',
              fields: { keyword: { type: 'keyword' } },
            },
            country: {
              type: 'text',
              analyzer: 'standard',
              fields: { keyword: { type: 'keyword' } },
            },
            year: { type: 'integer' },
            rating: { type: 'float' },
            duration: { type: 'integer' },
            priority: { type: 'integer' },
            featured: { type: 'boolean' },
            isDubbed: { type: 'boolean' },
            isKids: { type: 'boolean' },
            isComingSoon: { type: 'boolean' },

            // Display fields (not analyzed)
            posterUrl: { type: 'keyword', index: false },
            thumbnailUrl: { type: 'keyword', index: false },
            backdropUrl: { type: 'keyword', index: false },

            // SEO
            seoKeywords: { type: 'keyword' },

            // Timestamps
            createdAt: { type: 'date' },
            updatedAt: { type: 'date' },

            // Suggest field for autocomplete
            suggest: {
              type: 'completion',
              analyzer: 'search_analyzer',
              contexts: [
                { name: 'type', type: 'category' },
              ],
            },
          },
        },
      },
    });

    this.logger.log(`Created Elasticsearch index: ${this.indexName}`);
  }

  /**
   * Transform a Content entity into an Elasticsearch document
   */
  private contentToDocument(content: Content): Record<string, any> {
    const castNames = (content.cast || []).map((c) => c.name).filter(Boolean);
    const localizedContent = content.localizedContent || {};

    // Build suggestion inputs from various title fields
    const suggestInputs: string[] = [content.title];
    if (content.originalTitle) suggestInputs.push(content.originalTitle);
    if (localizedContent.fa?.title) suggestInputs.push(localizedContent.fa.title);
    if (localizedContent.en?.title) suggestInputs.push(localizedContent.en.title);

    return {
      title: content.title,
      originalTitle: content.originalTitle,
      description: content.description,
      shortDescription: content.shortDescription,
      tagline: content.tagline,

      localizedTitle_fa: localizedContent.fa?.title || null,
      localizedTitle_en: localizedContent.en?.title || null,
      localizedDescription_fa: localizedContent.fa?.description || null,
      localizedDescription_en: localizedContent.en?.description || null,

      type: content.type,
      status: content.status,
      accessType: content.accessType,
      genres: content.genres || [],
      tags: content.tags || [],
      director: content.director,
      castNames,
      country: content.country,
      year: content.year,
      rating: content.rating ? parseFloat(content.rating.toString()) : null,
      duration: content.duration,
      priority: content.priority,
      featured: content.featured,
      isDubbed: content.isDubbed,
      isKids: content.isKids,
      isComingSoon: content.isComingSoon,

      posterUrl: content.posterUrl,
      thumbnailUrl: content.thumbnailUrl,
      backdropUrl: content.backdropUrl,

      seoKeywords: content.seo?.keywords || [],

      createdAt: content.createdAt,
      updatedAt: content.updatedAt,

      suggest: {
        input: suggestInputs.filter(Boolean),
        weight: content.featured ? 10 : (content.priority || 1),
        contexts: {
          type: [content.type],
        },
      },
    };
  }

  /**
   * Index a single content document
   */
  async indexContent(content: Content): Promise<void> {
    if (!this.isConnected) return;

    try {
      await this.client.index({
        index: this.indexName,
        id: content.id,
        body: this.contentToDocument(content),
        refresh: true,
      });
      this.logger.debug(`Indexed content: ${content.id} - ${content.title}`);
    } catch (error) {
      this.logger.error(`Failed to index content ${content.id}: ${error.message}`);
    }
  }

  /**
   * Remove a content document from the index
   */
  async removeContent(contentId: string): Promise<void> {
    if (!this.isConnected) return;

    try {
      await this.client.delete({
        index: this.indexName,
        id: contentId,
        refresh: true,
      });
      this.logger.debug(`Removed content from index: ${contentId}`);
    } catch (error) {
      if (error.meta?.statusCode !== 404) {
        this.logger.error(`Failed to remove content ${contentId}: ${error.message}`);
      }
    }
  }

  /**
   * Bulk reindex all published content
   */
  async reindexAll(): Promise<{ indexed: number; errors: number; took: number }> {
    const start = Date.now();
    let indexed = 0;
    let errors = 0;

    try {
      // Delete and recreate index
      const exists = await this.client.indices.exists({ index: this.indexName });
      if (exists) {
        await this.client.indices.delete({ index: this.indexName });
      }
      await this.ensureIndex();

      // Fetch all published content
      const allContent = await this.contentRepository.find({
        where: { status: ContentStatus.PUBLISHED },
      });

      if (allContent.length === 0) {
        return { indexed: 0, errors: 0, took: Date.now() - start };
      }

      // Bulk index in batches of 100
      const batchSize = 100;
      for (let i = 0; i < allContent.length; i += batchSize) {
        const batch = allContent.slice(i, i + batchSize);
        const body = batch.flatMap((content) => [
          { index: { _index: this.indexName, _id: content.id } },
          this.contentToDocument(content),
        ]);

        const result = await this.client.bulk({ body, refresh: i + batchSize >= allContent.length });

        if (result.errors) {
          const failedItems = result.items.filter((item: any) => item.index?.error);
          errors += failedItems.length;
          indexed += batch.length - failedItems.length;
          failedItems.forEach((item: any) => {
            this.logger.error(`Bulk index error: ${JSON.stringify(item.index?.error)}`);
          });
        } else {
          indexed += batch.length;
        }
      }

      this.logger.log(`Reindex complete: ${indexed} indexed, ${errors} errors`);
    } catch (error) {
      this.logger.error(`Reindex failed: ${error.message}`);
      throw error;
    }

    return { indexed, errors, took: Date.now() - start };
  }

  /**
   * Full-text search with fuzzy matching, boosted fields, filters, and highlighting
   */
  async search(query: SearchQueryDto): Promise<SearchResponse> {
    const { q, type, genre, year, country, page = 1, limit = 20, sort = 'relevance' } = query;
    const from = (page - 1) * limit;

    // Check cache first
    const cacheKey = `search:${JSON.stringify({ q, type, genre, year, country, page, limit, sort })}`;
    const cached = await this.cacheManager.get<SearchResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    // If ES is not connected, fall back to DB search
    if (!this.isConnected) {
      return this.fallbackSearch(q, type, page, limit);
    }

    try {
      // Build must queries (main search)
      const must: any[] = [
        {
          multi_match: {
            query: q,
            type: 'best_fields',
            fields: [
              'title^5',
              'title.autocomplete^2',
              'originalTitle^3',
              'originalTitle.autocomplete^1.5',
              'localizedTitle_fa^4',
              'localizedTitle_fa.autocomplete^2',
              'localizedTitle_en^3',
              'localizedTitle_en.autocomplete^1.5',
              'description^1.5',
              'shortDescription^1.5',
              'localizedDescription_fa^1.5',
              'localizedDescription_en^1',
              'tagline^1',
              'director^2',
              'castNames^2',
              'tags^1.5',
              'seoKeywords^1',
            ],
            fuzziness: 'AUTO',
            prefix_length: 1,
            minimum_should_match: '75%',
            tie_breaker: 0.3,
          },
        },
      ];

      // Filter: only published content
      const filter: any[] = [
        { term: { status: ContentStatus.PUBLISHED } },
      ];

      if (type) {
        filter.push({ term: { type } });
      }
      if (genre) {
        filter.push({ term: { genres: genre.toLowerCase() } });
      }
      if (year) {
        filter.push({ term: { year } });
      }
      if (country) {
        filter.push({ wildcard: { 'country.keyword': `*${country}*` } });
      }

      // Build sort
      const sortClause: any[] = [];
      switch (sort) {
        case 'rating':
          sortClause.push({ rating: { order: 'desc', missing: '_last' } });
          break;
        case 'year':
          sortClause.push({ year: { order: 'desc', missing: '_last' } });
          break;
        case 'newest':
          sortClause.push({ createdAt: { order: 'desc' } });
          break;
        default:
          // relevance – use _score
          sortClause.push({ _score: { order: 'desc' } });
          // Boost featured content
          sortClause.push({ featured: { order: 'desc' } });
          sortClause.push({ priority: { order: 'desc', missing: '_last' } });
          break;
      }

      const response = await this.client.search({
        index: this.indexName,
        body: {
          from,
          size: limit,
          query: {
            bool: {
              must,
              filter,
            },
          },
          sort: sortClause,
          highlight: {
            pre_tags: ['<mark>'],
            post_tags: ['</mark>'],
            fields: {
              title: { number_of_fragments: 0 },
              originalTitle: { number_of_fragments: 0 },
              description: { fragment_size: 200, number_of_fragments: 1 },
              localizedTitle_fa: { number_of_fragments: 0 },
              localizedTitle_en: { number_of_fragments: 0 },
              localizedDescription_fa: { fragment_size: 200, number_of_fragments: 1 },
              director: { number_of_fragments: 0 },
              castNames: { number_of_fragments: 0 },
            },
          },
          _source: true,
        },
        request_cache: true,
      });

      const hits = response.hits.hits;
      const total = typeof response.hits.total === 'number'
        ? response.hits.total
        : (response.hits.total as any)?.value || 0;

      const items: SearchResultItem[] = hits.map((hit: any) => ({
        id: hit._id,
        title: hit._source.title,
        originalTitle: hit._source.originalTitle,
        description: hit._source.description,
        shortDescription: hit._source.shortDescription,
        type: hit._source.type,
        year: hit._source.year,
        rating: hit._source.rating,
        posterUrl: hit._source.posterUrl,
        thumbnailUrl: hit._source.thumbnailUrl,
        backdropUrl: hit._source.backdropUrl,
        genres: hit._source.genres || [],
        tags: hit._source.tags || [],
        director: hit._source.director,
        country: hit._source.country,
        duration: hit._source.duration,
        accessType: hit._source.accessType,
        featured: hit._source.featured,
        isDubbed: hit._source.isDubbed,
        localizedContent: this.reconstructLocalizedContent(hit._source),
        highlights: hit.highlight || {},
        score: hit._score,
      }));

      const result: SearchResponse = {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        took: response.took || 0,
        query: q,
      };

      // Cache for 120 seconds
      await this.cacheManager.set(cacheKey, result, 120);

      return result;
    } catch (error) {
      this.logger.error(`Search error: ${error.message}`);
      return this.fallbackSearch(q, type, page, limit);
    }
  }

  /**
   * Autocomplete suggestions using completion suggester + prefix match
   */
  async suggest(query: SuggestQueryDto): Promise<SuggestResponse> {
    const { q, limit = 8 } = query;

    // Check cache
    const cacheKey = `suggest:${q}:${limit}`;
    const cached = await this.cacheManager.get<SuggestResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    if (!this.isConnected) {
      return this.fallbackSuggest(q, limit);
    }

    try {
      // Use both completion suggester and prefix search for best results
      const response = await this.client.search({
        index: this.indexName,
        body: {
          size: 0,
          suggest: {
            title_suggest: {
              prefix: q,
              completion: {
                field: 'suggest',
                size: limit,
                skip_duplicates: true,
                fuzzy: {
                  fuzziness: 'AUTO',
                  prefix_length: 1,
                },
              },
            },
          },
        },
      });

      // Also do a quick prefix search for broader matching
      const prefixResponse = await this.client.search({
        index: this.indexName,
        body: {
          size: limit,
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    query: q,
                    type: 'bool_prefix',
                    fields: [
                      'title.autocomplete^5',
                      'originalTitle.autocomplete^3',
                      'localizedTitle_fa.autocomplete^4',
                      'localizedTitle_en.autocomplete^3',
                      'title^3',
                      'originalTitle^2',
                    ],
                  },
                },
              ],
              filter: [
                { term: { status: ContentStatus.PUBLISHED } },
              ],
            },
          },
          highlight: {
            pre_tags: ['<mark>'],
            post_tags: ['</mark>'],
            fields: {
              title: { number_of_fragments: 0 },
              originalTitle: { number_of_fragments: 0 },
              localizedTitle_fa: { number_of_fragments: 0 },
              localizedTitle_en: { number_of_fragments: 0 },
            },
          },
          _source: ['title', 'originalTitle', 'type', 'year', 'rating', 'posterUrl', 'thumbnailUrl', 'genres', 'accessType'],
        },
      });

      // Merge results, deduplicate by ID
      const seen = new Set<string>();
      const items: SuggestItem[] = [];

      // Completion suggester results
      const suggestions = (response.suggest as any)?.title_suggest?.[0]?.options || [];
      for (const option of suggestions) {
        if (!seen.has(option._id) && items.length < limit) {
          seen.add(option._id);
          items.push({
            id: option._id,
            title: option._source?.title || option.text,
            originalTitle: option._source?.originalTitle || null,
            type: option._source?.type,
            year: option._source?.year,
            rating: option._source?.rating,
            posterUrl: option._source?.posterUrl,
            thumbnailUrl: option._source?.thumbnailUrl,
            genres: option._source?.genres || [],
            accessType: option._source?.accessType || 'free',
          });
        }
      }

      // Prefix search results
      const prefixHits = prefixResponse.hits.hits;
      for (const hit of prefixHits) {
        if (!seen.has(hit._id) && items.length < limit) {
          seen.add(hit._id);
          const src = hit._source as any;
          items.push({
            id: hit._id,
            title: src.title,
            originalTitle: src.originalTitle,
            type: src.type,
            year: src.year,
            rating: src.rating,
            posterUrl: src.posterUrl,
            thumbnailUrl: src.thumbnailUrl,
            genres: src.genres || [],
            accessType: src.accessType || 'free',
            highlight: (hit.highlight as any)?.title?.[0] || (hit.highlight as any)?.localizedTitle_fa?.[0] || undefined,
          });
        }
      }

      const result: SuggestResponse = {
        items: items.slice(0, limit),
        total: items.length,
        took: (response.took || 0) + (prefixResponse.took || 0),
        query: q,
      };

      // Cache suggestions for 60 seconds
      await this.cacheManager.set(cacheKey, result, 60);

      return result;
    } catch (error) {
      this.logger.error(`Suggest error: ${error.message}`);
      return this.fallbackSuggest(q, limit);
    }
  }

  /**
   * Reconstruct localizedContent from flat ES fields
   */
  private reconstructLocalizedContent(source: any): Record<string, any> | null {
    const result: Record<string, any> = {};
    let hasContent = false;

    if (source.localizedTitle_fa || source.localizedDescription_fa) {
      result.fa = {};
      if (source.localizedTitle_fa) result.fa.title = source.localizedTitle_fa;
      if (source.localizedDescription_fa) result.fa.description = source.localizedDescription_fa;
      hasContent = true;
    }

    if (source.localizedTitle_en || source.localizedDescription_en) {
      result.en = {};
      if (source.localizedTitle_en) result.en.title = source.localizedTitle_en;
      if (source.localizedDescription_en) result.en.description = source.localizedDescription_en;
      hasContent = true;
    }

    return hasContent ? result : null;
  }

  /**
   * Fallback to database search when Elasticsearch is unavailable
   */
  private async fallbackSearch(
    q: string,
    type?: ContentType,
    page: number = 1,
    limit: number = 20,
  ): Promise<SearchResponse> {
    const start = Date.now();
    const skip = (page - 1) * limit;

    const queryBuilder = this.contentRepository
      .createQueryBuilder('content')
      .where('content.status = :status', { status: ContentStatus.PUBLISHED })
      .andWhere(
        '(content.title ILIKE :q OR content.description ILIKE :q OR content.original_title ILIKE :q OR content.director ILIKE :q)',
        { q: `%${q}%` },
      );

    if (type) {
      queryBuilder.andWhere('content.type = :type', { type });
    }

    const [items, total] = await queryBuilder
      .orderBy('content.rating', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        originalTitle: item.originalTitle,
        description: item.description,
        shortDescription: item.shortDescription,
        type: item.type,
        year: item.year,
        rating: item.rating ? parseFloat(item.rating.toString()) : null,
        posterUrl: item.posterUrl,
        thumbnailUrl: item.thumbnailUrl,
        backdropUrl: item.backdropUrl,
        genres: item.genres || [],
        tags: item.tags || [],
        director: item.director,
        country: item.country,
        duration: item.duration,
        accessType: item.accessType,
        featured: item.featured,
        isDubbed: item.isDubbed,
        localizedContent: item.localizedContent,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      took: Date.now() - start,
      query: q,
    };
  }

  /**
   * Fallback to database suggest when Elasticsearch is unavailable
   */
  private async fallbackSuggest(q: string, limit: number = 8): Promise<SuggestResponse> {
    const start = Date.now();
    const items = await this.contentRepository
      .createQueryBuilder('content')
      .select([
        'content.id', 'content.title', 'content.originalTitle',
        'content.type', 'content.year', 'content.rating',
        'content.posterUrl', 'content.thumbnailUrl', 'content.genres', 'content.accessType',
      ])
      .where('content.status = :status', { status: ContentStatus.PUBLISHED })
      .andWhere(
        '(content.title ILIKE :q OR content.original_title ILIKE :q)',
        { q: `%${q}%` },
      )
      .orderBy('content.rating', 'DESC')
      .take(limit)
      .getMany();

    return {
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        originalTitle: item.originalTitle,
        type: item.type,
        year: item.year,
        rating: item.rating ? parseFloat(item.rating.toString()) : null,
        posterUrl: item.posterUrl,
        thumbnailUrl: item.thumbnailUrl,
        genres: item.genres || [],
        accessType: item.accessType,
      })),
      total: items.length,
      took: Date.now() - start,
      query: q,
    };
  }

  /**
   * Get the connection status
   */
  isElasticsearchConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get index stats
   */
  async getIndexStats(): Promise<{ documentCount: number; sizeInBytes: number; isConnected: boolean }> {
    if (!this.isConnected) {
      return { documentCount: 0, sizeInBytes: 0, isConnected: false };
    }

    try {
      const stats = await this.client.indices.stats({ index: this.indexName });
      const indexStats = stats._all?.primaries;
      return {
        documentCount: indexStats?.docs?.count || 0,
        sizeInBytes: indexStats?.store?.size_in_bytes || 0,
        isConnected: true,
      };
    } catch (error) {
      return { documentCount: 0, sizeInBytes: 0, isConnected: true };
    }
  }
}
