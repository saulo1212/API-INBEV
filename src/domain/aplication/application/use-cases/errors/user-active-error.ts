import { UseCaseError } from '@/core/errors/use-case-error'

export class UserActiveError extends Error implements UseCaseError {
  constructor(indentifier: string) {
    super(`${indentifier} Entre em contato com o suporte`)
  }
}
