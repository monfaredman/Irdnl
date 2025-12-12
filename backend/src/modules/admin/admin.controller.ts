import {
  Controller,
  Post,
  Put,
  Delete,
  Param,
  Body,
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
  async updateContent(
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
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
}

