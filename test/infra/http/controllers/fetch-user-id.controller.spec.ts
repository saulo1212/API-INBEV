import { Test, TestingModule } from '@nestjs/testing';

import { FetchIdUserUseCase } from '@/domain/aplication/application/use-cases/user/fetch-id-user';
import { BadRequestException } from '@nestjs/common';
import { FetchIdUserPresenter } from '@/infra/http/presenters/user/ftch-id-user-presenter';
import { FetchIdUserController } from '@/infra/http/controllers/user/fetch-user-id.controller';

describe('FetchIdUserController', () => {
  let controller: FetchIdUserController;
  let fetchIdUserUseCase: FetchIdUserUseCase;
  const id = '12345';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchIdUserController],
      providers: [
        {
          provide: FetchIdUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FetchIdUserController>(FetchIdUserController);
    fetchIdUserUseCase = module.get<FetchIdUserUseCase>(FetchIdUserUseCase);
  });

  it('deve buscar um usuário com sucesso', async () => {
    
    const user = {
      id,
      name: 'John Doe',
      userLogin: 'john_doe',
      email: 'john@example.com',
    };

    (fetchIdUserUseCase.execute as jest.Mock).mockResolvedValueOnce({
      isLeft: () => false,
      value: { user },
    });

    const result = await controller.handle(id);

    expect(result).toEqual({
      user: FetchIdUserPresenter.toHttp(user),
    });
    expect(fetchIdUserUseCase.execute).toHaveBeenCalledWith({ id });
  });

  it('deve retornar null se o usuário não for encontrado', async () => {

    (fetchIdUserUseCase.execute as jest.Mock).mockResolvedValueOnce({
      isLeft: () => false,
      value: { user: null },
    });

    const result = await controller.handle(id);

    expect(result).toBeNull();
    expect(fetchIdUserUseCase.execute).toHaveBeenCalledWith({ id });
  });

  it('deve lançar BadRequestException se houver erro ao buscar o usuário', async () => {

    (fetchIdUserUseCase.execute as jest.Mock).mockResolvedValueOnce({
      isLeft: () => true,
      value: new Error('Error fetching user'),
    });

    await expect(controller.handle(id)).rejects.toThrow(BadRequestException);
  });
});
