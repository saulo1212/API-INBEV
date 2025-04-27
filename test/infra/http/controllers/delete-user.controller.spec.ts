import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserController } from '@/infra/http/controllers/user/delete-user.controller';
import { DeleteUserUseCase } from '@/domain/aplication/application/use-cases/user/delete-user';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { AlreadyExistsError } from '@/domain/aplication/application/use-cases/errors/AlreadyExistsError';

describe('DeleteUserController', () => {
  let controller: DeleteUserController;
  let deleteUserUseCase: DeleteUserUseCase;
  const id = '12345';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteUserController],
      providers: [
        {
          provide: DeleteUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeleteUserController>(DeleteUserController);
    deleteUserUseCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
  });

  it('deve deletar um usuário com sucesso', async () => {


    (deleteUserUseCase.execute as jest.Mock).mockResolvedValueOnce({
      isLeft: () => false,
    });

    await expect(controller.handle(id)).resolves.not.toThrow();

    expect(deleteUserUseCase.execute).toHaveBeenCalledWith({ id });
  });

  it('deve lançar ConflictException se AlreadyExistsError ocorrer', async () => {


    (deleteUserUseCase.execute as jest.Mock).mockResolvedValueOnce({
      isLeft: () => true,
      value: new AlreadyExistsError('User cannot be deleted'),
    });

    await expect(controller.handle(id)).rejects.toThrow(ConflictException);
  });

  it('deve lançar BadRequestException para outros erros', async () => {
  

    (deleteUserUseCase.execute as jest.Mock).mockResolvedValueOnce({
      isLeft: () => true,
      value: new Error('Unexpected error'),
    });

    await expect(controller.handle(id)).rejects.toThrow(BadRequestException);
  });
});
