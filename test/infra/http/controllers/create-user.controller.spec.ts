import { Test, TestingModule } from '@nestjs/testing';

import { CreateUserUseCase } from '@/domain/aplication/application/use-cases/user/create-user';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { AlreadyExistsError } from '@/domain/aplication/application/use-cases/errors/AlreadyExistsError';
import { CreateAccountController } from '@/infra/http/controllers/user/create-user.controller';

describe('CreateAccountController', () => {
  let controller: CreateAccountController;
  let createUserUseCase: CreateUserUseCase;

  const body = {
    name: 'John Doe',
    userLogin: 'johndoe',
    email: 'john@example.com',
    active: true,
    password: 'password123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateAccountController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateAccountController>(CreateAccountController);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('deve criar um usuário com sucesso', async () => {

    (createUserUseCase.execute as jest.Mock).mockResolvedValueOnce({
      isLeft: () => false,
    });

    await expect(controller.handle(body)).resolves.not.toThrow();

    expect(createUserUseCase.execute).toHaveBeenCalledWith(body);
  });

  it('deve lançar ConflictException se AlreadyExistsError ocorrer', async () => {
    

    (createUserUseCase.execute as jest.Mock).mockResolvedValueOnce({
      isLeft: () => true,
      value: new AlreadyExistsError('User already exists'),
    });

    await expect(controller.handle(body)).rejects.toThrow(ConflictException);
  });

  it('deve lançar BadRequestException para outros erros', async () => {

    (createUserUseCase.execute as jest.Mock).mockResolvedValueOnce({
      isLeft: () => true,
      value: new Error('Unexpected error'),
    });

    await expect(controller.handle(body)).rejects.toThrow(BadRequestException);
  });
});
