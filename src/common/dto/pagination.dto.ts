import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  size?: number = 10;

  @ApiPropertyOptional({ example: 'createdAt', default: 'createdAt' })
  @IsString()
  @IsOptional()
  field?: string = 'createdAt';

  @ApiPropertyOptional({ example: 'desc', enum: ['asc', 'desc'], default: 'desc' })
  @IsString()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  direction?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  searchText?: string;
}
