import { Injectable, Logger } from '@nestjs/common';
import { validate as isUuid } from 'uuid';
import { User } from '@/domain/aplication/enterprise/entities/user';
import { RedisService } from '@/infra/cache/redis-service';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { UserRepository } from '@/domain/aplication/application/repositories/user/user-repository';
import { PrismaUserWhithLoginMapper } from '../mappers/prisma-user-whith-login-mapper';
import { PrismaService } from '../prisma.service';
import { PageParams } from '@/core/repositories/pageParams';

@Injectable()
export class PrismaUsersRepository implements UserRepository {
  private readonly logger = new Logger(PrismaUsersRepository.name);
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async delete(id: string): Promise<void> {
    await this.prisma.user.deleteMany({
      where: { id },
    });

    const userCacheKey = `user:${id}`;
    await this.redisService.del(userCacheKey);

    this.logger.log(`Usuário ${id} deletado do banco e removido do cache.`);
  }

  async findById(id: string): Promise<User | null> {
    if (!isUuid(id)) {
      throw new Error('ID inválido');
    }

    const cacheKey = `user:${id}`;

    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      const parsed = JSON.parse(cached);
      this.logger.log(`buscando usuário pelo id no cache ${parsed} `);
      return PrismaUserMapper.fromJSON(parsed);
    }

    const result = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!result) return null;

    return PrismaUserMapper.toDomain(result);
  }

  async findMany({ page }: PageParams): Promise<User[]> {
  
   


    const result = await this.prisma.user.findMany({
      take: 20,
      skip: (page - 1) * 20,
    });

    const users = result.map(PrismaUserMapper.toDomain);

  
    return users;
  }

  async findByUserLogin(userLogin: string): Promise<User | null> {
    const result = await this.prisma.user.findUnique({
      where: { userLogin },
    });

    if (!result) return null;

    return PrismaUserWhithLoginMapper.toDomain(result);
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data,
    });

    const userCacheKey = `user:${user.id}`;
    await this.redisService.set(
      userCacheKey,
      JSON.stringify(user),
      'EX',
      60 * 60,
    );
    this.logger.log(`Usuário ${user.id} criado e salvo no cache.`);
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    });

    const userCacheKey = `user:${user.id}`;

    await this.redisService.set(
      userCacheKey,
      JSON.stringify(user),
      'EX',
      60 * 60,
    );

    this.logger.log(`Usuário ${user.id} atualizado e salvo no cache.`);
  }
}
