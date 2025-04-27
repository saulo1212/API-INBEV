import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

export const uuidQueryParamSchema = z
  .string()
  .refine(
    (value) =>
      /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/.test(
        value,
      ),
    {
      message: 'Invalid UUID format',
    },
  );

export const FetchIdValidationPipe = new ZodValidationPipe(
  uuidQueryParamSchema,
);
