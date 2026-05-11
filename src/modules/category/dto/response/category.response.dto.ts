import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CategoryResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Tiên Hiệp' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'Truyện về quá trình tu hành của các bậc tiên nhân' })
  @Expose()
  description: string;

  @ApiProperty({ example: '2026-05-10T14:19:27.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2026-05-10T14:19:27.000Z' })
  @Expose()
  updatedAt: Date;

  static example = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Tiên Hiệp',
    description: 'Truyện về quá trình tu hành của các bậc tiên nhân',
    createdAt: '2026-05-10T14:19:27.000Z',
    updatedAt: '2026-05-10T14:19:27.000Z',
  };
}
