import { User } from '@/domain/aplication/enterprise/entities/user';

export class FetchIdUserPresenter {
  static toHttp(raw: User) {
    return {
      id: raw.id.toString(),
      name: raw.name,
      userLogin: raw.userLogin,
      email: raw.email,
      active: raw.active,
    };
  }
}
