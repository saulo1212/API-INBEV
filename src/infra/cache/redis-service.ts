import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { EnvService } from '../env/env.service';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor(private envService: EnvService) {
    this.redisClient = new Redis({
      host: this.envService.get('REDIS_HOST'),
      port: Number(this.envService.get('REDIS_PORT')),
    });
  }

  async set(
    key: string,
    value: string,
    mode: string,
    time: number,
  ): Promise<void> {
    await this.redisClient.setex(key, time, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
