import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserResponseDto } from './dto/response/user.response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationHelper } from '../../common/helpers/pagination.helper';
import { Prisma } from '../../../generated/prisma/client';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.create(createUserDto);
    return plainToInstance(UserResponseDto, user);
  }

  async findAll(paginationDto: PaginationDto) {
    const { skip, take } = PaginationHelper.getSkipTake(paginationDto);
    const orderBy = PaginationHelper.getOrderBy(paginationDto);
    
    const where: Prisma.UserWhereInput = paginationDto.searchText
      ? {
          OR: [
            { email: { contains: paginationDto.searchText, mode: 'insensitive' } },
            { username: { contains: paginationDto.searchText, mode: 'insensitive' } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.usersRepository.findAll({ skip, take, where, orderBy }),
      this.usersRepository.count(where),
    ]);

    const mappedData = data.map((item) => plainToInstance(UserResponseDto, item));

    return PaginationHelper.createPaginatedResponse(mappedData, total, paginationDto);
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ id });
    return plainToInstance(UserResponseDto, user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.update({
      where: { id },
      data: updateUserDto,
    });
    return plainToInstance(UserResponseDto, user);
  }

  async remove(id: string) {
    return this.usersRepository.delete({ id });
  }
}