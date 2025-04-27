import { UseCaseError } from '@/core/errors/use-case-error'

export class GenericError extends Error implements UseCaseError {
  constructor(indentifier: string) {
    super(indentifier)
  }
}
