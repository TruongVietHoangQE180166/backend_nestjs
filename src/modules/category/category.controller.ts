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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { CategoryResponseDto } from './dto/response/category.response.dto';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { ApiErrorResponses } from '../../common/decorators/api-error-responses.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RequiredPermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/constants/permissions';

@ApiTags('category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @RequiredPermissions(Permission.CREATE_CATEGORY)
  @Post()
  @ApiOperation({ summary: 'Tạo mới một thể loại (Admin only)' })
  @ApiSuccessResponse(CategoryResponseDto, false, 'Tạo mới thể loại thành công')
  @ApiErrorResponses({
    badRequest: true,
    resource: 'Category',
    path: '/category',
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @RequiredPermissions(Permission.VIEW_CATEGORIES)
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thể loại' })
  @ApiPaginatedResponse(CategoryResponseDto, 'Lấy danh sách thể loại thành công')
  @ApiErrorResponses({ resource: 'Category', path: '/category' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @RequiredPermissions(Permission.VIEW_CATEGORIES)
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một thể loại' })
  @ApiSuccessResponse(CategoryResponseDto, false, 'Lấy chi tiết thể loại thành công')
  @ApiErrorResponses({
    notFound: true,
    resource: 'Category',
    path: '/category/:id',
  })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @RequiredPermissions(Permission.UPDATE_CATEGORY)
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thể loại (Admin only)' })
  @ApiSuccessResponse(CategoryResponseDto, false, 'Cập nhật thể loại thành công')
  @ApiErrorResponses({
    badRequest: true,
    notFound: true,
    resource: 'Category',
    path: '/category/:id',
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @RequiredPermissions(Permission.DELETE_CATEGORY)
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa thể loại (Admin only)' })
  @ApiSuccessResponse(CategoryResponseDto, false, 'Xóa thể loại thành công')
  @ApiErrorResponses({
    notFound: true,
    resource: 'Category',
    path: '/category/:id',
  })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
