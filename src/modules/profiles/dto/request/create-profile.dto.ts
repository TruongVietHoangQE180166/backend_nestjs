import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 'clx1abc123def456' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'Link ảnh từ nguồn bên ngoài (Google, etc.)' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'uuid-123-456', description: 'ID của media đã upload lên hệ thống' })
  @IsString()
  @IsOptional()
  avatarId?: string;

  @ApiPropertyOptional({ example: 'Software developer passionate about NestJS' })
  @IsString()
  @IsOptional()
  bio?: string;
}
