import { User } from '@/domain/aplication/enterprise/entities/user';
import { left, right } from '@/core/either';
import { FetchIdUserUseCase } from '@/domain/aplication/application/use-cases/user/fetch-id-user';
import { UserRepository } from '@/domain/aplication/application/repositories/user/user-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

const TEST_USER_ID = '123';
const TEST_USER_NOT_FOUND_ID = '999';
const TEST_USER_DATA = {
  name: 'Test User',
  email: 'testuser@example.com',
  userLogin: 'testuser',
  password: 'password123',
  active: true,
};


class EntityNotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} with id ${id} not found`);
    this.name = `${entity}NotFoundError`;
  }
}

class MockUserRepository implements UserRepository {
  private users: User[];

  constructor() {
    const uniqueId = new UniqueEntityID(TEST_USER_ID);
    this.users = [
      User.create(TEST_USER_DATA, uniqueId), 
    ];
  }


  async findById(id: string): Promise<User | null> {
    const user = this.users.find(user => user.id.value === id);
    return user || null;
  }


  async save(user: User): Promise<void> {}
  async create(user: User): Promise<void> {}
  async findByUserLogin(login: string): Promise<User | null> {
    return null;
  }
  async findMany(): Promise<User[]> {
    return [];
  }
  async delete(id: string): Promise<void> {}
}

describe('FetchIdUserUseCase', () => {
  let fetchIdUserUseCase: FetchIdUserUseCase;
  let mockUserRepository: UserRepository;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    fetchIdUserUseCase = new FetchIdUserUseCase(mockUserRepository);
  });

  it('should return EntityNotFoundError if user is not found', async () => {
    const response = await fetchIdUserUseCase.execute({ id: TEST_USER_NOT_FOUND_ID });

    expect(response).toEqual(left(new EntityNotFoundError('User', TEST_USER_NOT_FOUND_ID)));
  });

  it('should return user when found', async () => {
    const response = await fetchIdUserUseCase.execute({ id: TEST_USER_ID });

    expect(response).toEqual(
      right({
        user: {
          _id: expect.objectContaining({
            value: TEST_USER_ID,
          }),
          props: expect.objectContaining({
            name: TEST_USER_DATA.name,
            email: TEST_USER_DATA.email,
            active: TEST_USER_DATA.active,
            password: TEST_USER_DATA.password,
            userLogin: TEST_USER_DATA.userLogin,
            createdAt: expect.any(Date),
          }),
        },
      }),
    );
  });
});
