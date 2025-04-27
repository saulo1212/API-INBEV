import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { AuthenticateUserResponse } from '@/core/types/authenticateUser-response';
import { UserRepository } from '../../repositories/user/user-repository';
import { Encrypter } from '../../cryptography/encrypter';
import { HashComparer } from '../../cryptography/hash-comparer';
import { UserActiveError } from '../errors/user-active-error';
import { WrongCredentialsError } from '../errors/wrong-credentials-error';

interface AuthenticateUserUseCaseRequest {
  userLogin: string;
  password: string;
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  AuthenticateUserResponse
>;

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashCompare: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    userLogin,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findByUserLogin(userLogin);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    if (!user.active) {
      return left(new UserActiveError(user.name));
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    });

    return right({
      accessToken,
      id: user.id.toString(),
      name: user.name,
      email: user.email,
    });
  }
}
