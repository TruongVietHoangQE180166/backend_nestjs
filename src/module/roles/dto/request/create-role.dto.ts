import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoleName } from '@prisma/client';

export class CreateRoleDto {
  @ApiProperty({ enum: RoleName, example: 'USER' })
  @IsEnum(RoleName)
  @IsNotEmpty()
  name: RoleName;

  @ApiPropertyOptional({ example: 'Default user role' })
  @IsString()
  @IsOptional()
  description?: string;
}
