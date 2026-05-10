import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../../generated/prisma/client';

@Injectable()
export class RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.RoleUncheckedCreateInput) {
    return this.prisma.role.create({
      data,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return this.prisma.role.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async count(where?: Prisma.RoleWhereInput) {
    return this.prisma.role.count({ where });
  }

  async findOne(where: Prisma.RoleWhereUniqueInput) {
    return this.prisma.role.findUnique({
      where,
    });
  }

  async update(params: {
    where: Prisma.RoleWhereUniqueInput;
    data: Prisma.RoleUncheckedUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.role.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.RoleWhereUniqueInput) {
    return this.prisma.role.delete({
      where,
    });
  }
}
