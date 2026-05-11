import { ApiProperty } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';

export class RoleResponseDto {
  static example = {
    id: 'clx1role000000001',
    name: 'USER' as RoleName,
    description: 'Default user role',
    createdAt: '2026-05-09T09:00:00.000Z',
    updatedAt: '2026-05-09T09:00:00.000Z',
  };

  @ApiProperty({ example: RoleResponseDto.example.id })
  id: string;

  @ApiProperty({ enum: RoleName, example: RoleResponseDto.example.name })
  name: RoleName;

  @ApiProperty({ required: false, nullable: true, example: RoleResponseDto.example.description })
  description: string | null;

  @ApiProperty({ example: RoleResponseDto.example.createdAt })
  createdAt: Date;

  @ApiProperty({ example: RoleResponseDto.example.updatedAt })
  updatedAt: Date;
}
