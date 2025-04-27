import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticateController } from '@/infra/http/controllers/user/authenticate.controller';
import { AuthenticateUserUseCase } from '@/domain/aplication/application/use-cases/user/authenticate-user';

describe('AuthenticateController', () => {
  let controller: AuthenticateController;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticateController],
      providers: [
        {
          provide: AuthenticateUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthenticateController>(AuthenticateController);
    authenticateUserUseCase = module.get<AuthenticateUserUseCase>(
      AuthenticateUserUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should authenticate a user successfully', async () => {
   const mockResponse = {
      accessToken: 'mocked_token',
      id: 'user-id-123',
      name: 'John Doe',
      email: 'john@example.com',
    }; 

    (authenticateUserUseCase.execute as jest.Mock).mockResolvedValueOnce({
      isLeft: () => false,
      value: mockResponse,
    });

    const body = {
      userLogin: 'john@example.com',
      password: '123456',
    };

    const result = await controller.handle(body);

    expect(result).toEqual({
      access_token: 'mocked_token',
      id: 'user-id-123',
      name: 'John Doe',
      email: 'john@example.com',
    });
    expect(authenticateUserUseCase.execute).toHaveBeenCalledWith({
      userLogin: body.userLogin,
      password: body.password,
    });
  });
});
