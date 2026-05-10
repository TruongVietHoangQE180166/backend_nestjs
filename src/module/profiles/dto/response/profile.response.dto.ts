import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  static example = {
    id: 'clx1prof000000001',
    userId: 'clx1abc123def456',
    fullName: 'John Doe',
    avatarUrl: 'https://example.com/avatar.jpg',
    bio: 'Software developer passionate about NestJS',
    createdAt: '2026-05-09T09:00:00.000Z',
    updatedAt: '2026-05-09T09:00:00.000Z',
  };

  @ApiProperty({ example: ProfileResponseDto.example.id })
  id: string;

  @ApiProperty({ example: ProfileResponseDto.example.userId })
  userId: string;

  @ApiProperty({ required: false, nullable: true, example: ProfileResponseDto.example.fullName })
  fullName: string | null;

  @ApiProperty({ required: false, nullable: true, example: ProfileResponseDto.example.avatarUrl })
  avatarUrl: string | null;

  @ApiProperty({ required: false, nullable: true, example: ProfileResponseDto.example.bio })
  bio: string | null;

  @ApiProperty({ example: ProfileResponseDto.example.createdAt })
  createdAt: Date;

  @ApiProperty({ example: ProfileResponseDto.example.updatedAt })
  updatedAt: Date;
}
