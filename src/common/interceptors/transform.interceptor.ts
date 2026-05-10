import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  result: T;
  success: boolean;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        
        // Nếu data trả về đã có dạng chuẩn thì giữ nguyên
        if (data && typeof data === 'object' && 'statusCode' in data && 'message' in data && 'result' in data && 'success' in data) {
          return data;
        }

        return {
          statusCode: response.statusCode,
          message: 'Success',
          result: data !== undefined ? data : null,
          success: true,
        };
      }),
    );
  }
}
