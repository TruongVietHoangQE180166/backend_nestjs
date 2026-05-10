import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty({ example: true })
  success: boolean;

  // result sẽ được định nghĩa thông qua schema động
}

export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request Exception' })
  message: string;

  @ApiProperty({ example: null, nullable: true, type: Object })
  result: any;

  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: '2026-05-09T09:02:14.000Z' })
  timestamp: string;

  @ApiProperty({ example: '/api/users' })
  path: string;
}
