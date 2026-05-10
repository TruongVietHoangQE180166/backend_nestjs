import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { RoleResponseDto } from '../../../roles/dto/response/role.response.dto';

export class UserResponseDto {
  static example = {
    id: 'clx1abc123def456',
    email: 'user@example.com',
    username: 'johndoe',
    googleId: null,
    roleId: 'clx1role000000001',
    isActive: true,
    createdAt: '2026-05-09T09:00:00.000Z',
    updatedAt: '2026-05-09T09:00:00.000Z',
  };

  @ApiProperty({ example: UserResponseDto.example.id })
  id: string;

  @ApiProperty({ example: UserResponseDto.example.email })
  email: string;

  @ApiProperty({ example: UserResponseDto.example.username })
  username: string;

  @ApiProperty({ required: false, nullable: true, example: null })
  @Exclude()
  passwordHash: string | null;

  @ApiProperty({ required: false, nullable: true, example: null })
  googleId: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: UserResponseDto.example.roleId })
  roleId: string;

  @ApiProperty({ example: UserResponseDto.example.createdAt })
  createdAt: Date;

  @ApiProperty({ example: UserResponseDto.example.updatedAt })
  updatedAt: Date;

  @ApiProperty({ type: () => RoleResponseDto })
  @Type(() => RoleResponseDto)
  role?: RoleResponseDto;
}
