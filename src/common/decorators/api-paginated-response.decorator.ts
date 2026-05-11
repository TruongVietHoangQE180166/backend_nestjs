import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseDto } from '../dto/response.dto';
import { PaginatedResponseDto, PaginationMeta } from '../dto/paginated-response.dto';

/**
 * Decorator dành riêng cho các API trả về dữ liệu phân trang.
 *
 * @example
 * \@ApiPaginatedResponse(CategoryResponseDto)
 */
export const ApiPaginatedResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  description: string = 'Request successful',
) => {
  const entityExample = (dataDto as any).example ?? {};

  const paginatedExample = {
    statusCode: 200,
    message: 'Success',
    success: true,
    result: {
      data: [entityExample],
      meta: {
        totalItems: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      },
    },
  };

  return applyDecorators(
    ApiExtraModels(ResponseDto, PaginatedResponseDto, PaginationMeta, dataDto),
    ApiOkResponse({
      description: description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              result: {
                allOf: [
                  { $ref: getSchemaPath(PaginatedResponseDto) },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: getSchemaPath(dataDto) },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
        example: paginatedExample,
      },
    }),
  );
};
