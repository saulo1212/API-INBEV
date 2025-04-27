import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../../repositories/user/user-repository';
import { fetchIdUserCaseRequestDto } from '../../DTO/fetchIdUserCaseRequest-dto';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { User } from '@/domain/aplication/enterprise/entities/user';

type DeleteUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    user: User;
  }
>;
@Injectable()
export class DeleteUserUseCase {
  private readonly logger = new Logger(DeleteUserUseCase.name);
  constructor(private repository: UserRepository) {}

  async execute({
    id,
  }: fetchIdUserCaseRequestDto): Promise<DeleteUseCaseResponse> {
    this.logger.log(`start delete user use case `);

    const isExistsUser = await this.repository.findById(id);

    if (!isExistsUser) {
      return left(new ResourceNotFoundError());
    }
    await this.repository.delete(id);
    this.logger.log(`usuario ${id} deteletado com sucesso`);

    return right({
      user: isExistsUser,
    });
  }
}
