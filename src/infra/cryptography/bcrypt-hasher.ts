import { HashComparer } from '@/domain/aplication/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/aplication/application/cryptography/hash-generator'

import { compare, hash } from 'bcryptjs'

export class BcrypterHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
