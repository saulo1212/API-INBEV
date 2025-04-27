import { isEmailValid } from '@/core/utils/isEmailValid';
import { z } from 'zod';

export const bodySchema = z.object({
  name: z.string().refine((name) => name.trim() !== '', {
    message: 'Name is required.',
  }),
  userLogin: z.string().refine((userLogin) => userLogin.trim() !== '', {
    message: 'user Login is required.',
  }),
  email: z
    .string()
    .refine((email) => email.trim() !== '' && isEmailValid(email), {
      message: 'Email is required and must be in a valid format.',
    }),
  active: z.boolean(),

  password: z.string().refine((password) => password.trim() !== '', {
    message: 'Password is required.',
  }),
});

export type BodySchema = z.infer<typeof bodySchema>;
