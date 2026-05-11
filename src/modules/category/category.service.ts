import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { CategoryResponseDto } from './dto/response/category.response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationHelper } from '../../common/helpers/pagination.helper';
import { Prisma } from '../../../generated/prisma/client';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existing = await this.categoryRepository.findOne({ name: createCategoryDto.name });
    if (existing) {
      throw new ConflictException(`Category with name "${createCategoryDto.name}" already exists`);
    }
    const category = await this.categoryRepository.create(createCategoryDto);
    return plainToInstance(CategoryResponseDto, category);
  }

  async createMany(createManyCategoriesDto: { categories: CreateCategoryDto[] }) {
    return this.categoryRepository.createMany(createManyCategoriesDto.categories);
  }

  async findAll(paginationDto: PaginationDto) {
    const { skip, take } = PaginationHelper.getSkipTake(paginationDto);
    const orderBy = PaginationHelper.getOrderBy(paginationDto);

    const where: Prisma.CategoryWhereInput = paginationDto.searchText
      ? {
          name: { contains: paginationDto.searchText, mode: 'insensitive' },
        }
      : {};

    const [data, total] = await Promise.all([
      this.categoryRepository.findAll({ skip, take, where, orderBy }),
      this.categoryRepository.count(where),
    ]);

    const mappedData = data.map((item) => plainToInstance(CategoryResponseDto, item));

    return PaginationHelper.createPaginatedResponse(mappedData, total, paginationDto);
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return plainToInstance(CategoryResponseDto, category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const current = await this.findOne(id);
    
    if (updateCategoryDto.name && updateCategoryDto.name !== current.name) {
      const existing = await this.categoryRepository.findOne({ name: updateCategoryDto.name });
      if (existing) {
        throw new ConflictException(`Category with name "${updateCategoryDto.name}" already exists`);
      }
    }

    const category = await this.categoryRepository.update({
      where: { id },
      data: updateCategoryDto,
    });
    return plainToInstance(CategoryResponseDto, category);
  }

  async remove(id: string) {
    await this.findOne(id);
    const category = await this.categoryRepository.delete({ id });
    return plainToInstance(CategoryResponseDto, category);
  }
}
