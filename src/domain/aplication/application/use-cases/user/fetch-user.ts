import { Either, right } from '@/core/either';
import { Injectable, Logger } from '@nestjs/common';

import { UserRepository } from '../../repositories/user/user-repository';
import { User } from '@/domain/aplication/enterprise/entities/user';
import { fetchPageUseCaseRequestDto } from '../../DTO/fetchPageUseCaseRequest-dto';

type FetchUseCaseResponse = Either<
  null,
  {
    users: User[];
  }
>;

@Injectable()
export class FetchUsersUseCase {
  private readonly logger = new Logger(FetchUsersUseCase.name);
  constructor(private repository: UserRepository) {}

  async execute({
    page,
  }: fetchPageUseCaseRequestDto): Promise<FetchUseCaseResponse> {
    this.logger.log(`start fetch use case `);
    const users = await this.repository.findMany({
      page,
    });

    this.logger.log(`usuarios listado com sucesso`);

    return right({
      users,
    });
  }
}
