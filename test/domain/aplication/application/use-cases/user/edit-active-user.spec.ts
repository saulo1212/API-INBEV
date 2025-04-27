import { EditActiveUserUseCase } from '@/domain/aplication/application/use-cases/user/edit-active-user';
import { UserRepository } from '@/domain/aplication/application/repositories/user/user-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { User } from '@/domain/aplication/enterprise/entities/user';

const makeUserRepository = (): jest.Mocked<UserRepository> => {
  return {
    save: jest.fn(),
    create: jest.fn(),
    findByUserLogin: jest.fn(),
    findMany: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),
  };
};

describe('EditActiveUserUseCase', () => {
  let useCase: EditActiveUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = makeUserRepository();
    useCase = new EditActiveUserUseCase(userRepository);
  });

  it('should edit user active status successfully', async () => {
    const fakeUser = User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'hashed-password',
      userLogin: 'jane.doe',
      active: false,
    });

    userRepository.findById.mockResolvedValue(fakeUser);

    const result = await useCase.execute({
      id: fakeUser.id.toString(),
      active: true,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.user.active).toBe(true);
    }
    expect(userRepository.save).toHaveBeenCalledWith(fakeUser);
  });

  it('should return ResourceNotFoundError if user not found', async () => {
    userRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute({
      id: 'non-existing-id',
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
    expect(userRepository.save).not.toHaveBeenCalled();
  });
});
