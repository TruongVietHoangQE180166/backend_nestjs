import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../../generated/prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({
      data,
    });
  }

  async createMany(data: Prisma.CategoryCreateManyInput[]) {
    return this.prisma.category.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return this.prisma.category.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async count(where?: Prisma.CategoryWhereInput) {
    return this.prisma.category.count({ where });
  }

  async findOne(where: Prisma.CategoryWhereUniqueInput) {
    return this.prisma.category.findUnique({
      where,
    });
  }

  async update(params: {
    where: Prisma.CategoryWhereUniqueInput;
    data: Prisma.CategoryUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.category.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.CategoryWhereUniqueInput) {
    return this.prisma.category.delete({
      where,
    });
  }
}
