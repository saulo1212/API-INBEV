import { Either, left, right } from '@/core/either';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@/domain/aplication/enterprise/entities/user';
import { UserRepository } from '../../repositories/user/user-repository';
import { HashGenerator } from '../../cryptography/hash-generator';
import { UserCreateDto } from '../../DTO/user/user-creat-dto';
import { AlreadyExistsError } from '../errors/AlreadyExistsError';

type UseCaseResponse = Either<
  AlreadyExistsError,
  {
    user: User;
  }
>;

@Injectable()
export class CreateUserUseCase {
   private readonly logger = new Logger(CreateUserUseCase.name);
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    userLogin,
    email,
    active,
    password,
  }: UserCreateDto): Promise<UseCaseResponse> {
    const userWithSameUserLogin =
      await this.userRepository.findByUserLogin(userLogin);

    if (userWithSameUserLogin) {
      this.logger.warn(`usuário ${userLogin} ja possui cadastro`);
      return left(new AlreadyExistsError(userLogin));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      userLogin,
      email,
      active,
      password: hashedPassword,
    });

    await this.userRepository.create(user);

    this.logger.log(` usuário ${email} cadastrado`);

    return right({
      user,
    });
  }
}
