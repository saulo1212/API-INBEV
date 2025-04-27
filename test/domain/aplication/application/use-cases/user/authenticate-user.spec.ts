import { Test, TestingModule } from '@nestjs/testing';
import { left, right } from '@/core/either';
import { AuthenticateUserUseCase } from '@/domain/aplication/application/use-cases/user/authenticate-user';
import { UserRepository } from '@/domain/aplication/application/repositories/user/user-repository';
import { HashComparer } from '@/domain/aplication/application/cryptography/hash-comparer';
import { Encrypter } from '@/domain/aplication/application/cryptography/encrypter';
import { WrongCredentialsError } from '@/domain/aplication/application/use-cases/errors/wrong-credentials-error';
import { UserActiveError } from '@/domain/aplication/application/use-cases/errors/user-active-error';

// Mocks das dependências
const mockUserRepository = {
  findByUserLogin: jest.fn(),
};

const mockHashComparer = {
  compare: jest.fn(),
};

const mockEncrypter = {
  encrypt: jest.fn(),
};

describe('AuthenticateUserUseCase', () => {
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticateUserUseCase,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: HashComparer, useValue: mockHashComparer },
        { provide: Encrypter, useValue: mockEncrypter },
      ],
    }).compile();

    authenticateUserUseCase = module.get<AuthenticateUserUseCase>(AuthenticateUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authenticateUserUseCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return WrongCredentialsError if user is not found', async () => {
      mockUserRepository.findByUserLogin.mockResolvedValue(null);

      const result = await authenticateUserUseCase.execute({
        userLogin: 'testuser',
        password: 'testpassword',
      });

      expect(result).toEqual(left(new WrongCredentialsError()));
    });

    it('should return UserActiveError if user is inactive', async () => {
      mockUserRepository.findByUserLogin.mockResolvedValue({
        active: false,
        id: '1',
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'hashedpassword',
      });

      const result = await authenticateUserUseCase.execute({
        userLogin: 'testuser',
        password: 'testpassword',
      });

      expect(result).toEqual(left(new UserActiveError('Test User')));
    });

    it('should return WrongCredentialsError if password is invalid', async () => {
      mockUserRepository.findByUserLogin.mockResolvedValue({
        active: true,
        id: '1',
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'hashedpassword',
      });
      mockHashComparer.compare.mockResolvedValue(false);

      const result = await authenticateUserUseCase.execute({
        userLogin: 'testuser',
        password: 'wrongpassword',
      });

      expect(result).toEqual(left(new WrongCredentialsError()));
    });

    it('should return access token if credentials are valid', async () => {
      mockUserRepository.findByUserLogin.mockResolvedValue({
        active: true,
        id: '1',
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'hashedpassword',
      });
      mockHashComparer.compare.mockResolvedValue(true);
      mockEncrypter.encrypt.mockResolvedValue('valid_token');

      const result = await authenticateUserUseCase.execute({
        userLogin: 'testuser',
        password: 'correctpassword',
      });

      expect(result).toEqual(
        right({
          accessToken: 'valid_token',
          id: '1',
          name: 'Test User',
          email: 'testuser@example.com',
        })
      );
    });
  });
});
