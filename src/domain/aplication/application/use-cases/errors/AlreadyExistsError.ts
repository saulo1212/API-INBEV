import { UseCaseError } from '@/core/errors/use-case-error'

export class AlreadyExistsError extends Error implements UseCaseError {
  constructor(indentifier: string) {
    super(`${indentifier} informado no cadastro ja existe`)
  }
}
