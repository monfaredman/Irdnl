import { Controller, Get, Put, Post, Body, Param, UseGuards, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto, ChangePasswordDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@ApiTags('users')
@Controller('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  async getMe(@CurrentUser() user: User) {
    const { passwordHash, ...result } = user;
    return result;
  }

  @Put('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateMe(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    const updated = await this.usersService.update(user.id, updateUserDto);
    const { passwordHash, ...result } = updated;
    return result;
  }

  @Post('me/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid current password' })
  async changePassword(@CurrentUser() user: User, @Body() changePasswordDto: ChangePasswordDto) {
    const fullUser = await this.usersService.findOne(user.id);
    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, fullUser.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('رمز عبور فعلی اشتباه است');
    }
    const newHash = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.usersService.update(user.id, { passwordHash: newHash } as any);
    return { message: 'رمز عبور با موفقیت تغییر کرد' };
  }

  @Get('by-id/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get user by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'User retrieved' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    const { passwordHash, ...result } = user;
    return result;
  }
}
