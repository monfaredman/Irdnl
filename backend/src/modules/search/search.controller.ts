import { Controller, Get, Post, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ElasticsearchService } from './elasticsearch.service';
import { SearchQueryDto, SuggestQueryDto } from './dto/search.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  @Get()
  @ApiOperation({ summary: 'Full-text search with filters, fuzzy matching, and highlighting' })
  @ApiResponse({ status: 200, description: 'Search results with highlights and pagination' })
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async search(@Query() query: SearchQueryDto) {
    const trimmed = (query.q || '').trim();
    if (!trimmed || trimmed.length < 1) {
      return {
        items: [],
        total: 0,
        page: 1,
        limit: query.limit || 20,
        totalPages: 0,
        took: 0,
        query: '',
      };
    }
    return this.elasticsearchService.search({ ...query, q: trimmed });
  }

  @Get('suggest')
  @ApiOperation({ summary: 'Autocomplete suggestions for search queries' })
  @ApiResponse({ status: 200, description: 'Autocomplete suggestions with thumbnails' })
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  async suggest(@Query() query: SuggestQueryDto) {
    const trimmed = (query.q || '').trim();
    if (!trimmed || trimmed.length < 1) {
      return {
        items: [],
        total: 0,
        took: 0,
        query: '',
      };
    }
    return this.elasticsearchService.suggest({ ...query, q: trimmed });
  }

  @Post('reindex')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reindex all published content (admin only)' })
  @ApiResponse({ status: 200, description: 'Reindex results' })
  async reindex() {
    const result = await this.elasticsearchService.reindexAll();
    return {
      message: 'Reindex completed',
      ...result,
    };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get search index statistics (admin only)' })
  @ApiResponse({ status: 200, description: 'Index statistics' })
  async getStats() {
    return this.elasticsearchService.getIndexStats();
  }

  @Get('health')
  @ApiOperation({ summary: 'Check Elasticsearch connection health' })
  @ApiResponse({ status: 200, description: 'Health status' })
  async health() {
    return {
      elasticsearch: this.elasticsearchService.isElasticsearchConnected(),
    };
  }
}
