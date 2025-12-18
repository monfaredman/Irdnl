import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ListContentDto } from './dto/list-content.dto';
import { CreateSeasonDto } from './dto/create-season.dto';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MarkTranscodedDto } from './dto/mark-transcoded.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('admin')
@Controller('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('content')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create content (admin only)' })
  @ApiResponse({ status: 201, description: 'Content created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createContent(@Body() createContentDto: CreateContentDto) {
    return this.adminService.createContent(createContentDto);
  }

  @Put('content/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update content (admin only)' })
  @ApiResponse({ status: 200, description: 'Content updated' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async updateContent(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.adminService.updateContent(id, updateContentDto);
  }

  @Delete('content/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete content (admin only)' })
  @ApiResponse({ status: 204, description: 'Content deleted' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async deleteContent(@Param('id') id: string) {
    await this.adminService.deleteContent(id);
  }

  @Post('videos/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload video file (admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        contentId: {
          type: 'string',
        },
        quality: {
          type: 'string',
          example: '1080p',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Video uploaded' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body('contentId') contentId: string,
    @Body('quality') quality: string,
  ) {
    return this.adminService.uploadVideo(contentId, file, quality);
  }

  @Get('content')
  @ApiOperation({ summary: 'List content with pagination (admin only)' })
  @ApiResponse({ status: 200, description: 'Content list' })
  async listContent(@Query() listContentDto: ListContentDto) {
    return this.adminService.listContent(listContentDto);
  }

  @Get('content/:id')
  @ApiOperation({ summary: 'Get content by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Content details' })
  async getContent(@Param('id') id: string) {
    return this.adminService.getContent(id);
  }

  @Post('videos/:assetId/mark-transcoded')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark video asset as transcoded (admin only)' })
  @ApiResponse({ status: 200, description: 'Video asset updated' })
  @ApiResponse({ status: 404, description: 'Video asset not found' })
  async markTranscoded(
    @Param('assetId') assetId: string,
    @Body() markTranscodedDto: MarkTranscodedDto,
  ) {
    return this.adminService.markTranscoded(assetId, markTranscodedDto);
  }

  @Get('videos')
  @ApiOperation({ summary: 'List video assets (admin only)' })
  @ApiResponse({ status: 200, description: 'Video assets list' })
  async listVideoAssets(@Query('contentId') contentId?: string) {
    return this.adminService.listVideoAssets(contentId);
  }

  @Get('videos/:id')
  @ApiOperation({ summary: 'Get video asset by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Video asset details' })
  async getVideoAsset(@Param('id') id: string) {
    return this.adminService.getVideoAsset(id);
  }

  @Post('seasons')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create season (admin only)' })
  @ApiResponse({ status: 201, description: 'Season created' })
  async createSeason(@Body() createSeasonDto: CreateSeasonDto) {
    return this.adminService.createSeason(createSeasonDto);
  }

  @Post('episodes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create episode (admin only)' })
  @ApiResponse({ status: 201, description: 'Episode created' })
  async createEpisode(@Body() createEpisodeDto: CreateEpisodeDto) {
    return this.adminService.createEpisode(createEpisodeDto);
  }

  @Get('users')
  @ApiOperation({ summary: 'List users with pagination (admin only)' })
  @ApiResponse({ status: 200, description: 'Users list' })
  async listUsers(@Query() listUsersDto: ListUsersDto) {
    return this.adminService.listUsers(listUsersDto);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'User details' })
  async getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Patch('users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user (admin only)' })
  @ApiResponse({ status: 200, description: 'User updated' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (admin only)' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  async deleteUser(@Param('id') id: string) {
    await this.adminService.deleteUser(id);
  }

  @Post('images/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload image (poster/banner) (admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          enum: ['poster', 'banner'],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: 'poster' | 'banner',
  ) {
    return this.adminService.uploadImage(file, type);
  }
}
