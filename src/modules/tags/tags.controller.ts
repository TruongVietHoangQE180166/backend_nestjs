import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CreateManyTagsDto, CreateTagDto } from './dto/request/create-tag.dto';
import { UpdateTagDto } from './dto/request/update-tag.dto';
import { TagResponseDto } from './dto/response/tag.response.dto';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { ApiErrorResponses } from '../../common/decorators/api-error-responses.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RequiredPermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/constants/permissions';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiBearerAuth()
  @RequiredPermissions(Permission.CREATE_TAG)
  @Post()
  @ApiOperation({ summary: 'Tạo mới một nhãn (Admin only)' })
  @ApiSuccessResponse(TagResponseDto, false, 'Tạo mới nhãn thành công')
  @ApiErrorResponses({
    badRequest: true,
    resource: 'Tag',
    path: '/tags',
  })
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @ApiBearerAuth()
  @RequiredPermissions(Permission.CREATE_TAG)
  @Post('bulk')
  @ApiOperation({ summary: 'Tạo nhiều nhãn cùng lúc (Admin only)' })
  @ApiSuccessResponse(TagResponseDto, true, 'Tạo nhiều nhãn thành công')
  @ApiErrorResponses({
    badRequest: true,
    resource: 'Tag',
    path: '/tags/bulk',
  })
  createMany(@Body() createManyTagsDto: CreateManyTagsDto) {
    return this.tagsService.createMany(createManyTagsDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách nhãn' })
  @ApiPaginatedResponse(TagResponseDto, 'Lấy danh sách nhãn thành công')
  @ApiErrorResponses({ resource: 'Tag', path: '/tags' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.tagsService.findAll(paginationDto);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một nhãn' })
  @ApiSuccessResponse(TagResponseDto, false, 'Lấy chi tiết nhãn thành công')
  @ApiErrorResponses({
    notFound: true,
    resource: 'Tag',
    path: '/tags/:id',
  })
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  @ApiBearerAuth()
  @RequiredPermissions(Permission.UPDATE_TAG)
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật nhãn (Admin only)' })
  @ApiSuccessResponse(TagResponseDto, false, 'Cập nhật nhãn thành công')
  @ApiErrorResponses({
    badRequest: true,
    notFound: true,
    resource: 'Tag',
    path: '/tags/:id',
  })
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @ApiBearerAuth()
  @RequiredPermissions(Permission.DELETE_TAG)
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa nhãn (Admin only)' })
  @ApiSuccessResponse(TagResponseDto, false, 'Xóa nhãn thành công')
  @ApiErrorResponses({
    notFound: true,
    resource: 'Tag',
    path: '/tags/:id',
  })
  remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }
}
