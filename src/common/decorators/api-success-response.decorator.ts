import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseDto } from '../dto/response.dto';

/**
 * Decorator tự động lấy example từ static property của entity.
 * Entity cần khai báo: `static example = { ... }`
 *
 * @example
 * // Single object
 * \@ApiSuccessResponse(UserEntity)
 *
 * // Array
 * \@ApiSuccessResponse(UserEntity, true)
 */
export const ApiSuccessResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  isArray: boolean = false,
) => {
  const entityExample = (dataDto as any).example ?? {};

  const resultExample = isArray ? [entityExample] : entityExample;

  const successExample = {
    statusCode: 200,
    message: 'Success',
    success: true,
    result: resultExample,
  };

  const resultSchema = isArray
    ? { type: 'array', items: { $ref: getSchemaPath(dataDto) } }
    : { $ref: getSchemaPath(dataDto) };

  return applyDecorators(
    ApiExtraModels(ResponseDto, dataDto),
    ApiOkResponse({
      description: 'Request successful',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          { properties: { result: resultSchema } },
        ],
        example: successExample,
      },
    }),
  );
};
