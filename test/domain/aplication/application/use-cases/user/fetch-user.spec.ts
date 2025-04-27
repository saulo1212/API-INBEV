import { right } from '@/core/either';
import { UserRepository } from '@/domain/aplication/application/repositories/user/user-repository';
import { FetchUsersUseCase } from '@/domain/aplication/application/use-cases/user/fetch-user';
import { User } from '@/domain/aplication/enterprise/entities/user';

const mockUserData = [
  {
    name: 'User 1',
    userLogin: 'user1',
    email: 'user1@example.com',
    password: 'password123',
    active: true,
    createdAt: new Date(),
  },
  {
    name: 'User 2',
    userLogin: 'user2',
    email: 'user2@example.com',
    password: 'password123',
    active: true,
    createdAt: new Date(),
  },
];

class MockUserRepository implements UserRepository {
  private users = mockUserData.map(data =>
    User.create(data)
  );

 
  async findMany({ page }: { page: number }): Promise<User[]> {
    const pageSize = 2;
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;

    return this.users.slice(startIdx, endIdx);
  }

  
  async save(user: User): Promise<void> {}
  async create(user: User): Promise<void> {
    return Promise.resolve();
  }
  async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.id.value === id) || null;
  }
  async findByUserLogin(login: string): Promise<User | null> {
    return this.users.find(user => user.userLogin === login) || null;
  }
  async delete(id: string): Promise<void> {}
}

describe('FetchUsersUseCase', () => {
  let fetchUsersUseCase: FetchUsersUseCase;
  let mockUserRepository: UserRepository;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    fetchUsersUseCase = new FetchUsersUseCase(mockUserRepository);
  });

  it('should return users when page 1 is requested', async () => {
    const response = await fetchUsersUseCase.execute({ page: 1 });

    expect(response).toEqual(
      right({
        users: mockUserData.map(user => expect.objectContaining({
          name: user.name,
          email: user.email,
        })),
      }),
    );
  });

  it('should return empty array when no users are found for requested page', async () => {
    const response = await fetchUsersUseCase.execute({ page: 3 });

    expect(response).toEqual(right({ users: [] }));
  });

  it('should return users for page 2', async () => {
    const response = await fetchUsersUseCase.execute({ page: 2 });

    expect(response).toEqual(
      right({
        users: mockUserData.slice(2, 4).map(user => expect.objectContaining({
          name: user.name,
          email: user.email,
        })),
      }),
    );
  });

  it('should return empty array for page beyond the total users', async () => {
    const response = await fetchUsersUseCase.execute({ page: 10 });

    expect(response).toEqual(right({ users: [] }));
  });
});
