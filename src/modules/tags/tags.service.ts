import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TagsRepository } from './tags.repository';
import { CreateTagDto } from './dto/request/create-tag.dto';
import { UpdateTagDto } from './dto/request/update-tag.dto';
import { TagResponseDto } from './dto/response/tag.response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationHelper } from '../../common/helpers/pagination.helper';
import { Prisma } from '../../../generated/prisma/client';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TagsService {
  constructor(private readonly tagsRepository: TagsRepository) {}

  async create(createTagDto: CreateTagDto) {
    const existing = await this.tagsRepository.findOne({
      name_type: {
        name: createTagDto.name,
        type: createTagDto.type,
      },
    });
    
    if (existing) {
      throw new ConflictException(`Tag with name "${createTagDto.name}" and type "${createTagDto.type}" already exists`);
    }

    const tag = await this.tagsRepository.create(createTagDto);
    return plainToInstance(TagResponseDto, tag);
  }

  async createMany(createManyTagsDto: { tags: CreateTagDto[] }) {
    return this.tagsRepository.createMany(createManyTagsDto.tags);
  }

  async findAll(paginationDto: PaginationDto) {
    const { skip, take } = PaginationHelper.getSkipTake(paginationDto);
    const orderBy = PaginationHelper.getOrderBy(paginationDto);

    const where: Prisma.TagWhereInput = paginationDto.searchText
      ? {
          name: { contains: paginationDto.searchText, mode: 'insensitive' },
        }
      : {};

    const [data, total] = await Promise.all([
      this.tagsRepository.findAll({ skip, take, where, orderBy }),
      this.tagsRepository.count(where),
    ]);

    const mappedData = data.map((item) => plainToInstance(TagResponseDto, item));

    return PaginationHelper.createPaginatedResponse(mappedData, total, paginationDto);
  }

  async findOne(id: string) {
    const tag = await this.tagsRepository.findOne({ id });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return plainToInstance(TagResponseDto, tag);
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const current = await this.findOne(id);

    // If changing name or type, check for duplicates
    const newName = updateTagDto.name ?? current.name;
    const newType = updateTagDto.type ?? current.type;

    if (newName !== current.name || newType !== current.type) {
      const existing = await this.tagsRepository.findOne({
        name_type: {
          name: newName,
          type: newType,
        },
      });
      if (existing) {
        throw new ConflictException(`Tag with name "${newName}" and type "${newType}" already exists`);
      }
    }

    const tag = await this.tagsRepository.update({
      where: { id },
      data: updateTagDto,
    });
    return plainToInstance(TagResponseDto, tag);
  }

  async remove(id: string) {
    await this.findOne(id);
    const tag = await this.tagsRepository.delete({ id });
    return plainToInstance(TagResponseDto, tag);
  }
}
