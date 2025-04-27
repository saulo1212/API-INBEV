import { UseCaseError } from '@/core/errors/use-case-error'

export class AuthenticateError extends Error implements UseCaseError {
  constructor(indentifier: string) {
    super(`${indentifier}`)
  }
}
