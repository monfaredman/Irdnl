import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe Updated' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldpassword123' })
  @IsString()
  @MinLength(1)
  currentPassword: string;

  @ApiProperty({ example: 'newpassword456' })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  newPassword: string;
}
