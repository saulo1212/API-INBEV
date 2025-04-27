import { z } from 'zod';
import {
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  HttpCode,
  Logger,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import {
  FetchIdValidationPipe,
  uuidQueryParamSchema,
} from '../../validateSchema/fetch-id';
import { userIdInterface } from '../../interfaces/user-id.interface';
import { DeleteUserUseCase } from '@/domain/aplication/application/use-cases/user/delete-user';
import { AlreadyExistsError } from '@/domain/aplication/application/use-cases/errors/AlreadyExistsError';

type FetchIdParam = z.infer<typeof uuidQueryParamSchema>;

@Controller('/user/:id')
@ApiTags('User')
@ApiBearerAuth()
export class DeleteUserController {
  private readonly logger = new Logger(DeleteUserController.name);
  constructor(private deleteUser: DeleteUserUseCase) {}

  @Delete()
  @ApiBody({ type: userIdInterface })
  @HttpCode(204)
  async handle(@Param('id', FetchIdValidationPipe) id: FetchIdParam) {
    this.logger.log(` usuario ${id} a ser deletado`);

    const result = await this.deleteUser.execute({ id });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case AlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return { message: true };
  }
}
