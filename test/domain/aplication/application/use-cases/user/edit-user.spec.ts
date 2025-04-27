import { EditUserUseCase } from '@/domain/aplication/application/use-cases/user/edit-user'
import { UserRepository } from '@/domain/aplication/application/repositories/user/user-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { User } from '@/domain/aplication/enterprise/entities/user'


const makeUserRepository = (): jest.Mocked<UserRepository> => {
  return {
    save: jest.fn(),
    create: jest.fn(),
    findByUserLogin: jest.fn(),
    findMany: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),
  }
}

describe('EditUserUseCase', () => {
  let useCase: EditUserUseCase
  let userRepository: jest.Mocked<UserRepository>

  beforeEach(() => {
    userRepository = makeUserRepository()
    useCase = new EditUserUseCase(userRepository)
  })

  it('should edit a user successfully', async () => {
    const fakeUser = User.create({
      name: 'Original Name',
      email: 'original@example.com',
      password: 'hashed-password',
      active: true,
      userLogin: 'original-login',
    })

    userRepository.findById.mockResolvedValue(fakeUser)

    const updatedData = {
      id: fakeUser.id.toString(),
      name: 'Updated Name',
      email: 'updated@example.com',
      active: false,
      userLogin: 'updated-login',
    }

    const result = await useCase.execute(updatedData)

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.name).toBe('Updated Name')
      expect(result.value.user.email).toBe('updated@example.com')
      expect(result.value.user.active).toBe(false)
      expect(result.value.user.userLogin).toBe('updated-login')
    }
    expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Updated Name',
      email: 'updated@example.com',
      active: false,
      userLogin: 'updated-login',
    }))
  })

  it('should return ResourceNotFoundError if user not found', async () => {
    userRepository.findById.mockResolvedValue(null)

    const result = await useCase.execute({
      id: 'non-existing-id',
      name: 'Name',
      email: 'email@example.com',
      active: true,
      userLogin: 'login',
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
    expect(userRepository.save).not.toHaveBeenCalled()
  })
})
