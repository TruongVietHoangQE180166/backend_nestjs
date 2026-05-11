import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TagType } from '../../../../../generated/prisma/client';

export class TagResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Hệ thống' })
  @Expose()
  name: string;

  @ApiProperty({ example: TagType.CONTENT, enum: TagType })
  @Expose()
  type: TagType;

  @ApiProperty({ example: '2026-05-10T14:19:27.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2026-05-10T14:19:27.000Z' })
  @Expose()
  updatedAt: Date;

  static example = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Hệ thống',
    type: TagType.CONTENT,
    createdAt: '2026-05-10T14:19:27.000Z',
    updatedAt: '2026-05-10T14:19:27.000Z',
  };
}
