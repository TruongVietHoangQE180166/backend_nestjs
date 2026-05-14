import { Injectable } from '@nestjs/common';
import { ProfilesRepository } from './profiles.repository';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationHelper } from '../../common/helpers/pagination.helper';
import { Prisma } from '../../../generated/prisma/client';
import { plainToInstance } from 'class-transformer';
import { ProfileResponseDto } from './dto/response/profile.response.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profilesRepository: ProfilesRepository,
    private readonly uploadService: UploadService,
  ) {}

  async create(data: any) {
    const profile = await this.profilesRepository.create(data);
    return plainToInstance(ProfileResponseDto, profile);
  }

  async findAll(paginationDto: PaginationDto) {
    const { skip, take } = PaginationHelper.getSkipTake(paginationDto);
    const orderBy = PaginationHelper.getOrderBy(paginationDto);

    const where: Prisma.ProfileWhereInput = paginationDto.searchText
      ? {
          OR: [
            { fullName: { contains: paginationDto.searchText, mode: 'insensitive' } },
            { bio: { contains: paginationDto.searchText, mode: 'insensitive' } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.profilesRepository.findAll({ skip, take, where, orderBy }),
      this.profilesRepository.count(where),
    ]);

    const mappedData = data.map((item) => plainToInstance(ProfileResponseDto, item));

    return PaginationHelper.createPaginatedResponse(mappedData, total, paginationDto);
  }

  async findOne(id: string) {
    const profile = await this.profilesRepository.findOne({ id });
    return plainToInstance(ProfileResponseDto, profile);
  }

  async update(id: string, data: any) {
    // 1. Xử lý xóa ảnh cũ nếu có avatarId mới hoặc avatarId bị set thành null
    if (data.avatarId !== undefined) {
      const oldProfile = await this.profilesRepository.findOne({ id });
      if (oldProfile?.avatarId && oldProfile.avatarId !== data.avatarId) {
        await this.uploadService.deleteImage(oldProfile.avatarId);
      }
    }

    const profile = await this.profilesRepository.update({
      where: { id },
      data,
    });
    return plainToInstance(ProfileResponseDto, profile);
  }

  async remove(id: string) {
    // 1. Xóa ảnh liên quan trước khi xóa profile
    const profileToDelete = await this.profilesRepository.findOne({ id });
    if (profileToDelete?.avatarId) {
      await this.uploadService.deleteImage(profileToDelete.avatarId);
    }

    const profile = await this.profilesRepository.delete({ id });
    return plainToInstance(ProfileResponseDto, profile);
  }

  async findByUserId(userId: string) {
    const profile = await this.profilesRepository.findOne({ userId });
    return plainToInstance(ProfileResponseDto, profile);
  }
}
