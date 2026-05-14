import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { UploadResponseDto } from './dto/response/upload.response.dto';
import { ApiErrorResponses } from '../../common/decorators/api-error-responses.decorator';
import { CLOUDINARY_DEFAULTS } from '../../config/cloudinary.config';
import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';

@ApiTags('upload')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @ApiOperation({ summary: 'Tải lên hình ảnh lên Cloudinary và lưu vào DB' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: `File hình ảnh (${CLOUDINARY_DEFAULTS.allowedFormats.join(', ')})`,
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiSuccessResponse(UploadResponseDto, false, 'Tải lên hình ảnh thành công')
  @ApiErrorResponses({ badRequest: true, path: '/upload/image' })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: CLOUDINARY_DEFAULTS.maxFileSize }),
          new FileTypeValidator({ fileType: CLOUDINARY_DEFAULTS.fileTypeRegex }),
        ],
      }),
    )
    file: Express.Multer.File,
    @GetCurrentUserId() userId: string,
  ) {
    const result = await this.uploadService.uploadImage(file, userId);
    return {
      url: result.url,
      publicId: result.publicId,
      format: result.format,
      bytes: result.bytes,
    };
  }
}
