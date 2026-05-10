import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : null;

    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exceptionResponse) {
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        error = (exceptionResponse as any).error || error;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse = {
      statusCode: status,
      message: Array.isArray(message) ? message[0] : message,
      result: null,
      success: false,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Mask password fields
    const safeBody = { ...request.body };
    if (safeBody.password) safeBody.password = '********';

    this.logger.error(
      `${request.method} ${request.url} ${status}`,
      {
        context: 'HttpException',
        message: message,
        query: request.query,
        body: safeBody,
        ip: request.ip,
        stack: exception instanceof Error ? exception.stack : undefined,
      },
    );

    response.status(status).json(errorResponse);
  }
}
