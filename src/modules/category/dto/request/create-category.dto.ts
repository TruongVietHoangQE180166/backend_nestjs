import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
