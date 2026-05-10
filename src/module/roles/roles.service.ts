import { Injectable } from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationHelper } from '../../common/helpers/pagination.helper';
import { Prisma } from '../../../generated/prisma/client';
import { plainToInstance } from 'class-transformer';
import { RoleResponseDto } from './dto/response/role.response.dto';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async create(data: any) {
    const role = await this.rolesRepository.create(data);
    return plainToInstance(RoleResponseDto, role);
  }

  async findAll(paginationDto: PaginationDto) {
    const { skip, take } = PaginationHelper.getSkipTake(paginationDto);
    const orderBy = PaginationHelper.getOrderBy(paginationDto);

    const where: Prisma.RoleWhereInput = paginationDto.searchText
      ? {
          name: {
            equals: paginationDto.searchText.toUpperCase() as any,
          },
        }
      : {};

    const [data, total] = await Promise.all([
      this.rolesRepository.findAll({ skip, take, where, orderBy }),
      this.rolesRepository.count(where),
    ]);

    const mappedData = data.map((item) => plainToInstance(RoleResponseDto, item));

    return PaginationHelper.createPaginatedResponse(mappedData, total, paginationDto);
  }

  async findOne(id: string) {
    const role = await this.rolesRepository.findOne({ id });
    return plainToInstance(RoleResponseDto, role);
  }

  async update(id: string, data: any) {
    const role = await this.rolesRepository.update({
      where: { id },
      data,
    });
    return plainToInstance(RoleResponseDto, role);
  }

  async remove(id: string) {
    return this.rolesRepository.delete({ id });
  }
}
