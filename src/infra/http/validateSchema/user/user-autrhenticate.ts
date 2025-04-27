import { z } from 'zod'

export const bodySchema = z.object({
  userLogin: z.string().refine((userLogin) => userLogin.trim() !== '', {
    message: 'O campo login e obrigatório.',
  }),
  password: z.string().refine((password) => password.trim() !== '', {
    message: 'O campo senha e obrigatório.',
  }),

})

export type BodySchema = z.infer<typeof bodySchema>
