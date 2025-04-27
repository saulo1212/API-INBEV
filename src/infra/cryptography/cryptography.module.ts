import { Encrypter } from '@/domain/aplication/application/cryptography/encrypter'
import { Module } from '@nestjs/common'
import { JwtEncrypter } from './jwt-encrypter'

import { HashGenerator } from '@/domain/aplication/application/cryptography/hash-generator'
import { BcrypterHasher } from './bcrypt-hasher'
import { HashComparer } from '@/domain/aplication/application/cryptography/hash-comparer'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcrypterHasher },
    { provide: HashGenerator, useClass: BcrypterHasher },

  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
