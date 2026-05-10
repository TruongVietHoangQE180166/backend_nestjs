import { PaginationDto } from '../dto/pagination.dto';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';

export class PaginationHelper {
  static getSkipTake(dto: PaginationDto) {
    const page = dto.page || 1;
    const size = dto.size || 10;
    const skip = (page - 1) * size;
    return { skip, take: size };
  }

  static getOrderBy(dto: PaginationDto) {
    const field = dto.field || 'createdAt';
    const direction = dto.direction || 'desc';
    return { [field]: direction };
  }

  static createPaginatedResponse<T>(
    data: T[],
    totalItems: number,
    dto: PaginationDto,
  ): PaginatedResponseDto<T> {
    const page = dto.page || 1;
    const size = dto.size || 10;
    const totalPages = Math.ceil(totalItems / size);

    return {
      data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: size,
        totalPages,
        currentPage: page,
      },
    };
  }
}
