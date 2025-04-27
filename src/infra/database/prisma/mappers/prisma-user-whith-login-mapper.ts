import { User } from '@/domain/aplication/enterprise/entities/user';

import { User as PrismaUser } from '@prisma/client';

type PrismaUserWithCompany = PrismaUser;

export class PrismaUserWhithLoginMapper {
  static toDomain(raw: PrismaUserWithCompany): User {
    return User.create({
      name: raw.name,
      userLogin: raw.userLogin,
      email: raw.email,
      active: raw.active,
      password: raw.password,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
