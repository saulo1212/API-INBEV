import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Logger,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { BodySchema, bodySchema } from '../../validateSchema/user/user-create';
import { AlreadyExistsError } from '@/domain/aplication/application/use-cases/errors/AlreadyExistsError';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from '@/domain/aplication/application/use-cases/user/create-user';
import { userHandleInterface } from '../../interfaces/userHandle.interface';
import { Public } from '@/infra/auth/public';

@Controller('/accounts')
@ApiTags('User')
@Public()
export class CreateAccountController {
  private readonly logger = new Logger(CreateAccountController.name);
  constructor(private registerUser: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiBody({ type: userHandleInterface })
  @UsePipes(new ZodValidationPipe(bodySchema))
  async handle(@Body() body: BodySchema) {
    const { name, userLogin, email, active, password } = body;

    this.logger.log(`Tentando criar usuário: ${email}`);

    const result = await this.registerUser.execute({
      name,
      userLogin,
      email,
      active,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      this.logger.warn(`Erro ao criar usuário: ${error.message}`);

      switch (error.constructor) {
        case AlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
    this.logger.log(`Usuário criado com sucesso: ${email}`);
  }
}
