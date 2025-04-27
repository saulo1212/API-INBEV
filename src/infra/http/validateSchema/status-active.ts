import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const bodySchema = z.object({
  active: z.boolean(),
});

export const bodyValidationPipe = new ZodValidationPipe(bodySchema);

export type BodySchema = z.infer<typeof bodySchema>;
