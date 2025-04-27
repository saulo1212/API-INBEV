import { User } from '@/domain/aplication/enterprise/entities/user';

export class UserPresenter {
  static toHttp(raw: User) {
    return {
      id: raw.id.toString(),
      name: raw.name,
      userLogin: raw.userLogin,
      email: raw.email,
      active: raw.active,
      dh_cadastro: raw.createdAt,
      dh_update: raw.updatedAt
    };
  }
}
