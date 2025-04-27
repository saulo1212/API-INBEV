import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserRepository } from '@/domain/aplication/application/repositories/user/user-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { RedisModule } from '../cache/redis.module';

@Module({
  imports: [RedisModule],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [PrismaService, UserRepository],
})
export class DatabaseModule {}
