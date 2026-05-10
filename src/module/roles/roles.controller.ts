import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { UpdateRoleDto } from './dto/request/update-role.dto';
import { RoleResponseDto } from './dto/response/role.response.dto';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { ApiErrorResponses } from '../../common/decorators/api-error-responses.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RequiredPermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/constants/permissions';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
@RequiredPermissions(Permission.MANAGE_ROLES)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a role' })
  @ApiSuccessResponse(RoleResponseDto)
  @ApiErrorResponses({ badRequest: true, resource: 'Role', path: '/roles' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiSuccessResponse(RoleResponseDto, true)
  @ApiErrorResponses({ resource: 'Role', path: '/roles' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.rolesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by id' })
  @ApiSuccessResponse(RoleResponseDto)
  @ApiErrorResponses({ notFound: true, resource: 'Role', path: '/roles/:id' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role' })
  @ApiSuccessResponse(RoleResponseDto)
  @ApiErrorResponses({ badRequest: true, notFound: true, resource: 'Role', path: '/roles/:id' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role' })
  @ApiSuccessResponse(RoleResponseDto)
  @ApiErrorResponses({ notFound: true, resource: 'Role', path: '/roles/:id' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
