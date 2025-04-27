import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { User } from '@/domain/aplication/enterprise/entities/user';
import { UserRepository } from '../../repositories/user/user-repository';
import { EditActiveDto } from '../../DTO/user/edit-active-dto';

type EditUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    user: User;
  }
>;

@Injectable()
export class EditActiveUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ id, active }: EditActiveDto): Promise<EditUseCaseResponse> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return left(new ResourceNotFoundError());
    }
    
    user.active = active;

    await this.userRepository.save(user);

    return right({
      user,
    });
  }
}
