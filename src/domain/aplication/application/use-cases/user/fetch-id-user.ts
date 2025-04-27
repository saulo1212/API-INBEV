import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { User } from '@/domain/aplication/enterprise/entities/user';
import { UserRepository } from '../../repositories/user/user-repository';
import { fetchIdUserCaseRequestDto } from '../../DTO/fetchIdUserCaseRequest-dto';



class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User with id ${id} not found`);
    this.name = 'UserNotFoundError';
  }
}

type FetchUserIdCaseResponse = Either<UserNotFoundError, { user: User | null }>

@Injectable()
export class FetchIdUserUseCase {
  private readonly logger = new Logger(FetchIdUserUseCase.name);
  constructor(private repository: UserRepository) {}

  async execute({
    id,
  }: fetchIdUserCaseRequestDto): Promise<FetchUserIdCaseResponse> {
    this.logger.log(`start fetch user id use case `);
    const user = await this.repository.findById(id);

    if (!user) {
      return left(new UserNotFoundError(id));
    }

    this.logger.log(`usuarios retornado com sucesso`);
    return right({
      user: user || null,
    });
  }
}
