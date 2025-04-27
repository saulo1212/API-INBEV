import { Test, TestingModule } from '@nestjs/testing';
import { FetchUserController } from '@/infra/http/controllers/user/fetch-user.controller';
import { FetchUsersUseCase } from '@/domain/aplication/application/use-cases/user/fetch-user';
import { BadRequestException } from '@nestjs/common';
import { UserPresenter } from '@/infra/http/presenters/user/user-presenter';

describe('FetchUserController', () => {
  let controller: FetchUserController;
  let fetchUsersUseCase: FetchUsersUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchUserController],
      providers: [
        {
          provide: FetchUsersUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FetchUserController>(FetchUserController);
    fetchUsersUseCase = module.get<FetchUsersUseCase>(FetchUsersUseCase);
  });

  it('deve listar usuários com sucesso', async () => {
    const page = 1;
    const users = [
      {
        id: '1',
        name: 'John Doe',
        userLogin: 'john_doe',
        email: 'john@example.com',
      },
      {
        id: '2',
        name: 'Jane Smith',
        userLogin: 'jane_smith',
        email: 'jane@example.com',
      },
    ];

    (fetchUsersUseCase.execute as jest.Mock).mockResolvedValueOnce({
      isLeft: () => false,
      value: { users },
    });

    const result = await controller.handle(page);

    expect(result).toEqual({
      users: users.map(UserPresenter.toHttp),
    });
    expect(fetchUsersUseCase.execute).toHaveBeenCalledWith({ page });
  });

  it('deve lançar BadRequestException se houver erro ao buscar os usuários', async () => {
    const page = 1;

    (fetchUsersUseCase.execute as jest.Mock).mockResolvedValueOnce({
      isLeft: () => true,
      value: new Error('Error fetching users'),
    });

    await expect(controller.handle(page)).rejects.toThrow(BadRequestException);
  });
});
