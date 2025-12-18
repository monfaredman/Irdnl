import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AdminResetPasswordDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  email: string;
}

export class AdminResetPasswordConfirmDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
