import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  JTW_PRIVATE_KEY: z.string(),
  JTW_PUBLIC_KEY: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT:z.coerce.number().optional().default(6379),
})

export type Env = z.infer<typeof envSchema>
