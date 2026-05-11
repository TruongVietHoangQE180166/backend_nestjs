import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Tiên Hiệp', description: 'Tên thể loại' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Truyện về quá trình tu hành của các bậc tiên nhân',
    description: 'Mô tả thể loại',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateManyCategoriesDto {
  @ApiProperty({ type: [CreateCategoryDto], description: 'Danh sách các thể loại cần tạo' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryDto)
  categories: CreateCategoryDto[];
}
