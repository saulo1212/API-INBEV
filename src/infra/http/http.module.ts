import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CreateAccountController } from './controllers/user/create-user.controller';
import { CreateUserUseCase } from '@/domain/aplication/application/use-cases/user/create-user';
import { FetchUserController } from './controllers/user/fetch-user.controller';
import { FetchUsersUseCase } from '@/domain/aplication/application/use-cases/user/fetch-user';
import { FetchIdUserController } from './controllers/user/fetch-user-id.controller';
import { FetchIdUserUseCase } from '@/domain/aplication/application/use-cases/user/fetch-id-user';
import { DeleteUserController } from './controllers/user/delete-user.controller';
import { DeleteUserUseCase } from '@/domain/aplication/application/use-cases/user/delete-user';
import { EditUserController } from './controllers/user/edit-user.controller';
import { EditUserUseCase } from '@/domain/aplication/application/use-cases/user/edit-user';
import { AuthenticateController } from './controllers/user/authenticate.controller';
import { AuthenticateUserUseCase } from '@/domain/aplication/application/use-cases/user/authenticate-user';
import { EditActiveUserController } from './controllers/user/edit-active-user.controller';
import { EditActiveUserUseCase } from '@/domain/aplication/application/use-cases/user/edit-active-user';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    FetchUserController,
    FetchIdUserController,
    DeleteUserController,
    EditUserController,
    AuthenticateController,
    EditActiveUserController
  ],
  providers: [
    CreateUserUseCase,
    FetchUsersUseCase,
    FetchIdUserUseCase,
    DeleteUserUseCase,
    EditUserUseCase,
    AuthenticateUserUseCase,
    EditActiveUserUseCase
  ],
})
export class HttpModule {}
