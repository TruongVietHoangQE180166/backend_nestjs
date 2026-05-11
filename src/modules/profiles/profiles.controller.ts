import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/request/create-profile.dto';
import { UpdateProfileDto } from './dto/request/update-profile.dto';
import { ProfileResponseDto } from './dto/response/profile.response.dto';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { ApiErrorResponses } from '../../common/decorators/api-error-responses.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('profiles')
@ApiBearerAuth()
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a profile' })
  @ApiSuccessResponse(ProfileResponseDto, false, 'Tạo hồ sơ thành công')
  @ApiErrorResponses({ badRequest: true, resource: 'Profile', path: '/profiles' })
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all profiles' })
  @ApiPaginatedResponse(ProfileResponseDto, 'Lấy danh sách hồ sơ thành công')
  @ApiErrorResponses({ resource: 'Profile', path: '/profiles' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.profilesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a profile by id' })
  @ApiSuccessResponse(ProfileResponseDto, false, 'Lấy chi tiết hồ sơ thành công')
  @ApiErrorResponses({ notFound: true, resource: 'Profile', path: '/profiles/:id' })
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a profile' })
  @ApiSuccessResponse(ProfileResponseDto, false, 'Cập nhật hồ sơ thành công')
  @ApiErrorResponses({ badRequest: true, notFound: true, resource: 'Profile', path: '/profiles/:id' })
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a profile' })
  @ApiSuccessResponse(ProfileResponseDto, false, 'Xóa hồ sơ thành công')
  @ApiErrorResponses({ notFound: true, resource: 'Profile', path: '/profiles/:id' })
  remove(@Param('id') id: string) {
    return this.profilesService.remove(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get a profile by userId' })
  @ApiSuccessResponse(ProfileResponseDto)
  @ApiErrorResponses({ notFound: true, resource: 'Profile', path: '/profiles/user/:userId' })
  findByUserId(@Param('userId') userId: string) {
    return this.profilesService.findByUserId(userId);
  }
}
