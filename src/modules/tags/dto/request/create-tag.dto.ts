import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { TagType } from '../../../../../generated/prisma/client';
import { Type } from 'class-transformer';

export class CreateTagDto {
  @ApiProperty({ example: 'Hệ thống', description: 'Tên nhãn' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: TagType.CONTENT,
    enum: TagType,
    description: 'Loại nhãn (CHARACTER, WORLD, CONTENT)',
  })
  @IsNotEmpty()
  @IsEnum(TagType)
  type: TagType;
}

export class CreateManyTagsDto {
  @ApiProperty({ type: [CreateTagDto], description: 'Danh sách các nhãn cần tạo' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTagDto)
  tags: CreateTagDto[];
}
