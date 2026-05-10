import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiPropertyOptional({ example: 'hashed_password_here' })
  @IsString()
  @IsOptional()
  passwordHash?: string;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsString()
  @IsOptional()
  googleId?: string;

  @ApiProperty({ example: 'clx1role000000001' })
  @IsString()
  @IsNotEmpty()
  roleId: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
