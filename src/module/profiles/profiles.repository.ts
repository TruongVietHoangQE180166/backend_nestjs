import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../../generated/prisma/client';

@Injectable()
export class ProfilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProfileUncheckedCreateInput) {
    return this.prisma.profile.create({
      data,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProfileWhereInput;
    orderBy?: Prisma.ProfileOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return this.prisma.profile.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async count(where?: Prisma.ProfileWhereInput) {
    return this.prisma.profile.count({ where });
  }

  async findOne(where: Prisma.ProfileWhereUniqueInput) {
    return this.prisma.profile.findUnique({
      where,
    });
  }

  async update(params: {
    where: Prisma.ProfileWhereUniqueInput;
    data: Prisma.ProfileUncheckedUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.profile.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.ProfileWhereUniqueInput) {
    return this.prisma.profile.delete({
      where,
    });
  }
}
