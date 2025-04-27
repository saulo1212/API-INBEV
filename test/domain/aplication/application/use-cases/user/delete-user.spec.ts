import { DeleteUserUseCase } from '@/domain/aplication/application/use-cases/user/delete-user';
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

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = makeUserRepository();
    useCase = new DeleteUserUseCase(userRepository);
  });

  it('should delete a user successfully', async () => {
    const fakeUser = User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      userLogin: 'john.doe',
      active: true,
    });

    userRepository.findById.mockResolvedValue(fakeUser);

    const result = await useCase.execute({ id: fakeUser.id.toString() });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.user).toEqual(fakeUser);
    }
    expect(userRepository.delete).toHaveBeenCalledWith(fakeUser.id.toString());
  });

  it('should return ResourceNotFoundError if user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute({ id: 'non-existing-id' });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
    expect(userRepository.delete).not.toHaveBeenCalled();
  });
});
