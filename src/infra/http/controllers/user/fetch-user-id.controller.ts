import { z } from 'zod';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
} from '@nestjs/common';
import {
  FetchIdValidationPipe,
  uuidQueryParamSchema,
} from '../../validateSchema/fetch-id';
import { FetchIdUserPresenter } from '../../presenters/user/ftch-id-user-presenter';
import { FetchIdUserUseCase } from '@/domain/aplication/application/use-cases/user/fetch-id-user';

type FetchIdParam = z.infer<typeof uuidQueryParamSchema>;

@Controller('/user/:id')
@ApiTags('User')
@ApiBearerAuth()
export class FetchIdUserController {
  private readonly logger = new Logger(FetchIdUserController.name);
  constructor(private fetch: FetchIdUserUseCase) {}

  @Get()
  async handle(@Param('id', FetchIdValidationPipe) id: FetchIdParam) {
    this.logger.log(`Buscando pelo usuario ${id}`);
    const result = await this.fetch.execute({
      id,
    });

    if (result.isLeft()) {
      this.logger.warn(`Erro ao buscar usuario ${id}`);
      throw new BadRequestException();
    }

    const user = result.value.user;

    if (!user) return null;

    return {
      user: FetchIdUserPresenter.toHttp(user),
    };
  }
}
