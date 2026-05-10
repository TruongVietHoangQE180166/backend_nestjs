import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class NotEmptyPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Chỉ kiểm tra dữ liệu gửi lên từ Body
    if (metadata.type === 'body') {
      if (!value || (typeof value === 'object' && Object.keys(value).length === 0)) {
        throw new BadRequestException('Dữ liệu gửi lên không được để trống');
      }
    }
    return value;
  }
}
