import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
  @ApiProperty({ example: 'eyJhbGciOiJSUzI1NiIsImtpZ...', description: 'ID Token nhận được từ Google' })
  @IsString()
  @IsNotEmpty({ message: 'Token không được để trống' })
  token: string;
}
