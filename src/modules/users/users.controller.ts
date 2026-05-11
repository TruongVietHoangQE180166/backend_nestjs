import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserResponseDto } from './dto/response/user.response.dto';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { ApiErrorResponses } from '../../common/decorators/api-error-responses.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RequiredPermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/constants/permissions';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @RequiredPermissions(Permission.CREATE_USER)
  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiSuccessResponse(UserResponseDto, false, 'Tạo người dùng thành công')
  @ApiErrorResponses({ badRequest: true, resource: 'User', path: '/users' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @RequiredPermissions(Permission.VIEW_USERS)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiPaginatedResponse(UserResponseDto, 'Lấy danh sách người dùng thành công')
  @ApiErrorResponses({ resource: 'User', path: '/users' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiSuccessResponse(UserResponseDto, false, 'Lấy chi tiết người dùng thành công')
  @ApiErrorResponses({ notFound: true, resource: 'User', path: '/users/:id' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiSuccessResponse(UserResponseDto, false, 'Cập nhật người dùng thành công')
  @ApiErrorResponses({ badRequest: true, notFound: true, resource: 'User', path: '/users/:id' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @RequiredPermissions(Permission.DELETE_USER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiSuccessResponse(UserResponseDto, false, 'Xóa người dùng thành công')
  @ApiErrorResponses({ notFound: true, resource: 'User', path: '/users/:id' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
