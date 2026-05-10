import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../../generated/prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserUncheckedCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        role: true,
      },
    });
  }

  async count(where?: Prisma.UserWhereInput) {
    return this.prisma.user.count({ where });
  }

  async findOne(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where,
      include: {
        role: true,
      },
    });
  }

  async findFirst(where: Prisma.UserWhereInput) {
    return this.prisma.user.findFirst({
      where,
    });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUncheckedUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({
      where,
    });
  }
}
