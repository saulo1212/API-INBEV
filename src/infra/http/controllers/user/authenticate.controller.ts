import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { WrongCredentialsError } from '@/domain/aplication/application/use-cases/errors/wrong-credentials-error';
import { Public } from '@/infra/auth/public';
import {
  BodySchema,
  bodySchema,
} from '../../validateSchema/user/user-autrhenticate';

import { ApiBody, ApiTags } from '@nestjs/swagger';
import { sessionsInterface } from '../../interfaces/sessions.interface';
import { AuthenticateUserUseCase } from '@/domain/aplication/application/use-cases/user/authenticate-user';

@Controller('/sessions')
@ApiTags('User')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @ApiBody({ type: sessionsInterface })
  @UsePipes(new ZodValidationPipe(bodySchema))
  async handle(@Body() body: BodySchema) {
    const { userLogin, password } = body;

    const resutl = await this.authenticateUser.execute({
      userLogin,
      password,
    });

    if (resutl.isLeft()) {
      const error = resutl.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken, id, name, email } = resutl.value;

    return {
      access_token: accessToken,
      id,
      email,
      name,
    };
  }
}
