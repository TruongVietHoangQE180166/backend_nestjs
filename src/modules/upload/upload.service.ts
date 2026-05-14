import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { getCloudinaryConfig } from '../../config/cloudinary.config';
import { PrismaService } from '../../prisma/prisma.service';
import { Media } from '../../../generated/prisma';

@Injectable()
export class UploadService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Upload an image to Cloudinary and save metadata to database
   * @param file The file from Multer
   * @param uploaderId ID of the user who uploaded the file
   * @param folder Optional folder name in Cloudinary
   * @returns Promise with Media record from database
   */
  async uploadImage(
    file: Express.Multer.File,
    uploaderId: string,
    folder?: string,
  ): Promise<Media> {
    const config = getCloudinaryConfig(this.configService);

    if (!file) {
      throw new BadRequestException('Không có file nào được tải lên');
    }

    // Kiểm tra định dạng file (chỉ cho phép ảnh)
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Chỉ cho phép tải lên tệp tin hình ảnh');
    }

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder || config.upload.folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(new BadRequestException('Lỗi khi tải ảnh lên Cloudinary'));
          resolve(result);
        },
      );

      // Ghi dữ liệu buffer vào stream
      uploadStream.end(file.buffer);
    });

    // Lưu vào database
    return this.prisma.media.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        uploaderId: uploaderId,
      },
    });
  }

  /**
   * Delete an image from Cloudinary and database
   * @param mediaId ID of the media record
   */
  async deleteImage(mediaId: string): Promise<void> {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) return;

    // 1. Xóa trên Cloudinary
    try {
      await cloudinary.uploader.destroy(media.publicId);
    } catch (error) {
      console.error(`Lỗi khi xóa ảnh trên Cloudinary (${media.publicId}):`, error);
      // Vẫn tiếp tục xóa trong DB hoặc ném lỗi tùy chiến lược
    }

    // 2. Xóa trong database
    await this.prisma.media.delete({
      where: { id: mediaId },
    });
  }
}
