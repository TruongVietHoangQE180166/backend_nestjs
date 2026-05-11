import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../../users/dto/response/user.response.dto';
import { Type } from 'class-transformer';

export class AuthResponseDto {
  static example = {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    user: UserResponseDto.example,
  };

  @ApiProperty({ example: AuthResponseDto.example.accessToken })
  accessToken: string;

  @ApiProperty({ type: UserResponseDto })
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
