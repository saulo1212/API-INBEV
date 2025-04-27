import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

import {
  BodySchema,
  bodyValidationPipe,
} from '../../validateSchema/user/user-edit';
import { userEditInterface } from '../../interfaces/user-edit.interface';
import { EditUserUseCase } from '@/domain/aplication/application/use-cases/user/edit-user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

@Controller('/user/:id')
@ApiTags('User')
@ApiBearerAuth()
export class EditUserController {
  private readonly logger = new Logger(EditUserController.name);
  constructor(private edit: EditUserUseCase) {}

  @Put()
  @ApiBody({ type: userEditInterface })
  @HttpCode(200)
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: BodySchema,
  ) {
    const { active, userLogin, name, email } = body;
    this.logger.log(`Tentando editar usuário: ${email}`);

    const result = await this.edit.execute({
      id,
      name,
      active,
      userLogin,
      email,
    });

    if (result.isLeft()) {
      const error = result.value;
      this.logger.warn(`Erro ao editar usuário ${email}: ${error.message}`);

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof NotAllowedError) {
        throw new ConflictException(error.message);
      }

      throw new BadRequestException(error);
    }
    return { message: true };
  }
}
