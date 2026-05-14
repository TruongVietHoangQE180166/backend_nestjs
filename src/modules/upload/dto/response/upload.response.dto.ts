import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    description: 'URL của file sau khi upload thành công',
    example: 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'ID định danh của file trên Cloudinary',
    example: 'hoang_backend/uploads/sample',
  })
  publicId: string;

  @ApiProperty({
    description: 'Định dạng của file',
    example: 'jpg',
  })
  format: string;

  @ApiProperty({
    description: 'Kích thước file (bytes)',
    example: 12345,
  })
  bytes: number;
}
