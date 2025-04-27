import {
  Get,
  Query,
  Controller,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { z } from 'zod';

import {
  pageQueryParamSchema,
  queryValidationPipe,
} from '@/infra/http/validateSchema/pageSchema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserPresenter } from '../../presenters/user/user-presenter';
import { FetchUsersUseCase } from '@/domain/aplication/application/use-cases/user/fetch-user';


type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/user')
@ApiTags('User')
@ApiBearerAuth()
export class FetchUserController {
  private readonly logger = new Logger(FetchUserController.name);
  constructor(private fetch: FetchUsersUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    this.logger.log(`Listando usuarios`);
    const result = await this.fetch.execute({
      page,
    });

    if (result.isLeft()) {
      this.logger.warn(`Erro ao buscar usuarios`);
      throw new BadRequestException();
    }

    const users = result.value.users;

    return {
      users: users.map(UserPresenter.toHttp),
    };
  }
}
