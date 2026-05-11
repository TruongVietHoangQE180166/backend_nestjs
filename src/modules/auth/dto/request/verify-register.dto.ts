import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyRegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @Length(8, 8, { message: 'Mã xác thực phải đúng 8 chữ số' })
  @IsNotEmpty({ message: 'Mã xác thực không được để trống' })
  code: string;
}
