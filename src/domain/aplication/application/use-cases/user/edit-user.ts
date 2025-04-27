import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { User } from '@/domain/aplication/enterprise/entities/user';
import { UserRepository } from '../../repositories/user/user-repository';
import { EditUserDto } from '../../DTO/user/user-edit-dto';

type EditUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    user: User;
  }
>;

@Injectable()
export class EditUserUseCase {
  private readonly logger = new Logger(EditUserUseCase.name);
  constructor(private repository: UserRepository) {}

  async execute({
    id,
    name,
    active,
    userLogin,
    email,
  }: EditUserDto): Promise<EditUseCaseResponse> {
    this.logger.log(`start edit user ${userLogin} use case `);
    const user = await this.repository.findById(id);

    console.log(`çççççç${JSON.stringify(user)}`)

    if (!user) {
      this.logger.warn(`usuário ${id} não encontrado`);
      return left(new ResourceNotFoundError());
    }

    Object.assign(user, {
      name,
      active,
      userLogin,
      email,
    });

    await this.repository.save(user);
    this.logger.log(`usuario ${id} editado  com sucesso`);

    return right({
      user,
    });
  }
}
