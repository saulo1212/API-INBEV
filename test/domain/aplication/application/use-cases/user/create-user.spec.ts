import { Test, TestingModule } from '@nestjs/testing';
import { left, right } from '@/core/either';
import { User } from '@/domain/aplication/enterprise/entities/user';
import { CreateUserUseCase } from '@/domain/aplication/application/use-cases/user/create-user';
import { UserRepository } from '@/domain/aplication/application/repositories/user/user-repository';
import { HashGenerator } from '@/domain/aplication/application/cryptography/hash-generator';
import { UserCreateDto } from '@/domain/aplication/application/DTO/user/user-creat-dto';
import { AlreadyExistsError } from '@/domain/aplication/application/use-cases/errors/AlreadyExistsError';

const mockUserRepository = {
  findByUserLogin: jest.fn(),
  create: jest.fn(),
};

const mockHashGenerator = {
  hash: jest.fn(),
};

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: HashGenerator, useValue: mockHashGenerator },
      ],
    }).compile();

    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(createUserUseCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return AlreadyExistsError if userLogin already exists', async () => {
      const userCreateDto: UserCreateDto = {
        name: 'Test User',
        userLogin: 'testuser',
        email: 'testuser@example.com',
        active: true,
        password: 'testpassword',
      };

      mockUserRepository.findByUserLogin.mockResolvedValueOnce(true);

      const result = await createUserUseCase.execute(userCreateDto);

      expect(result).toEqual(left(new AlreadyExistsError('testuser')));
      expect(mockUserRepository.findByUserLogin).toHaveBeenCalledWith(
        'testuser',
      );
    });
  });
});
