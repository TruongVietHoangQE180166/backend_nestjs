import { ApiProperty } from '@nestjs/swagger';

export class MediaResponseDto {
  @ApiProperty({ example: 'uuid-123-456' })
  id: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/.../image.jpg' })
  url: string;

  @ApiProperty({ example: 'hoang_backend/uploads/sample' })
  publicId: string;

  @ApiProperty({ example: 'jpg' })
  format: string;

  @ApiProperty({ example: 12345 })
  bytes: number;
}
