import { User } from '../../../enterprise/entities/user';
import { fetchPageUseCaseRequestDto } from '../../DTO/fetchPageUseCaseRequest-dto';

export abstract class UserRepository {
  abstract save(data: User): Promise<void>;
  abstract create(data: User): Promise<void>;
  abstract findByUserLogin(userLogin: string): Promise<User | null>;
  abstract findMany(params: fetchPageUseCaseRequestDto): Promise<User[]>;
  abstract findById(id: string): Promise<User | null>;
  abstract delete(id:string): Promise<void>;
}
