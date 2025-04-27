import { User as PrismaUser, Prisma } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { User } from '@/domain/aplication/enterprise/entities/user';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        userLogin: raw.userLogin,
        email: raw.email,
        password: raw.password,
        active: raw.active,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(raw: User): Prisma.UserUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      name: raw.name,
      userLogin: raw.userLogin,
      email: raw.email,
      password: raw.password,
      active: raw.active,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  static fromJSON(json: any): User {
    if (!json || !json.props) {
      throw new Error('Dados inválidos ou incompletos no cache');
    }
    return User.create(
      {
        name: json.props.name,
        userLogin: json.props.userLogin,
        email: json.props.email,
        password: json.props.password,
        active: json.props.active,
        createdAt: new Date(json.props.createdAt),
        updatedAt: json.props.updatedAt
          ? new Date(json.props.updatedAt)
          : undefined,
      },
      new UniqueEntityID(json._id.value),
    );
  }
}
