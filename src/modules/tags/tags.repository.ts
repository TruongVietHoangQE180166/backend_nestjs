import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../../generated/prisma/client';

@Injectable()
export class TagsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TagCreateInput) {
    return this.prisma.tag.create({
      data,
    });
  }

  async createMany(data: Prisma.TagCreateManyInput[]) {
    return this.prisma.tag.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return this.prisma.tag.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async count(where?: Prisma.TagWhereInput) {
    return this.prisma.tag.count({ where });
  }

  async findOne(where: Prisma.TagWhereUniqueInput) {
    return this.prisma.tag.findUnique({
      where,
    });
  }

  async update(params: {
    where: Prisma.TagWhereUniqueInput;
    data: Prisma.TagUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.tag.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.TagWhereUniqueInput) {
    return this.prisma.tag.delete({
      where,
    });
  }
}
