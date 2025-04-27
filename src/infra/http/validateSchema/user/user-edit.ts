import { z } from 'zod'
import { isEmailValid } from '@/core/utils/isEmailValid'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const bodySchema = z.object({
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
  
})

export const bodyValidationPipe = new ZodValidationPipe(bodySchema)

export type BodySchema = z.infer<typeof bodySchema>
