import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/response.dto';

interface ApiErrorResponsesOptions {
  /** Hiển thị 400 Bad Request. Mặc định: false */
  badRequest?: boolean;
  /** Hiển thị 401 Unauthorized. Mặc định: false */
  unauthorized?: boolean;
  /** Hiển thị 404 Not Found. Mặc định: false */
  notFound?: boolean;
  /** Hiển thị 500 Internal Server Error. Mặc định: true */
  serverError?: boolean;
  /** Tên resource dùng trong message ví dụ: 'User', 'Role', 'Profile' */
  resource?: string;
  /** Base path dùng trong timestamp example, ví dụ: '/users' */
  path?: string;
}

const makeErrorExample = (
  statusCode: number,
  message: string,
  error: string,
  path: string,
) => ({
  statusCode,
  message,
  result: null,
  success: false,
  error,
  timestamp: '2026-05-09T09:00:00.000Z',
  path,
});

/**
 * Decorator dùng chung để gắn các error response vào Swagger.
 * Đặt trong common, tái sử dụng ở mọi controller.
 */
export const ApiErrorResponses = (options: ApiErrorResponsesOptions = {}) => {
  const {
    badRequest = false,
    unauthorized = false,
    notFound = false,
    serverError = true,
    resource = 'Resource',
    path = '/',
  } = options;

  const decorators: MethodDecorator[] = [];

  if (badRequest) {
    decorators.push(
      ApiBadRequestResponse({
        description: 'Validation failed or invalid request body',
        type: ErrorResponseDto,
        example: makeErrorExample(400, 'Bad Request Exception', 'Bad Request', path),
      }),
    );
  }

  if (unauthorized) {
    decorators.push(
      ApiUnauthorizedResponse({
        description: 'Unauthorized access',
        type: ErrorResponseDto,
        example: makeErrorExample(401, 'Unauthorized', 'Unauthorized', path),
      }),
    );
  }

  if (notFound) {
    decorators.push(
      ApiNotFoundResponse({
        description: `${resource} not found`,
        type: ErrorResponseDto,
        example: makeErrorExample(
          404,
          `${resource} not found`,
          'Not Found',
          path,
        ),
      }),
    );
  }

  if (serverError) {
    decorators.push(
      ApiInternalServerErrorResponse({
        description: 'Unexpected server error',
        type: ErrorResponseDto,
        example: makeErrorExample(
          500,
          'Internal server error',
          'Internal Server Error',
          path,
        ),
      }),
    );
  }

  return applyDecorators(...decorators);
};
