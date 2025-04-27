import { Test, TestingModule } from '@nestjs/testing';
import { EditUserController } from '@/infra/http/controllers/user/edit-user.controller';
import { EditUserUseCase } from '@/domain/aplication/application/use-cases/user/edit-user';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

describe('EditUserController', () => {
  let controller: EditUserController;
  let editUserUseCase: EditUserUseCase;
  const id = '12345';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EditUserController],
      providers: [
        {
          provide: EditUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EditUserController>(EditUserController);
    editUserUseCase = module.get<EditUserUseCase>(EditUserUseCase);
  });

  it('deve editar um usuário com sucesso', async () => {

   
    const body = { name: 'John Doe', userLogin: 'john_doe', email: 'john@example.com', active: true };

    (editUserUseCase.execute as jest.Mock).mockResolvedValueOnce({
      isLeft: () => false,
    });

   
    await expect(controller.handle(id, body)).resolves.not.toThrow();

   
    expect(editUserUseCase.execute).toHaveBeenCalledWith({
      id,
      ...body,
    });
  });

  it('deve lançar NotFoundException se ResourceNotFoundError ocorrer', async () => {
   
    const body = { name: 'John Doe', userLogin: 'john_doe', email: 'john@example.com', active: true };

    (editUserUseCase.execute as jest.Mock).mockResolvedValueOnce({
      isLeft: () => true,
      value: new ResourceNotFoundError('User not found'),
    });

    
    await expect(controller.handle(id, body)).rejects.toThrow(NotFoundException);
  });

  it('deve lançar ConflictException se NotAllowedError ocorrer', async () => {
   
   
    const body = { name: 'John Doe', userLogin: 'john_doe', email: 'john@example.com', active: true };

    (editUserUseCase.execute as jest.Mock).mockResolvedValueOnce({
      isLeft: () => true,
      value: new NotAllowedError('User cannot be edited'),
    });

   
    await expect(controller.handle(id, body)).rejects.toThrow(ConflictException);
  });

  it('deve lançar BadRequestException para outros erros', async () => {

    const body = { name: 'John Doe', userLogin: 'john_doe', email: 'john@example.com', active: true };

    (editUserUseCase.execute as jest.Mock).mockResolvedValueOnce({
      isLeft: () => true,
      value: new Error('Unexpected error'),
    });

  
    await expect(controller.handle(id, body)).rejects.toThrow(BadRequestException);
  });
});
