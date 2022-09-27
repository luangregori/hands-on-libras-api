import { Hasher, HashComparer, Encrypter } from '@/data/protocols'

import faker from 'faker'

export class HasherSpy implements Hasher {
  digest = faker.datatype.uuid()
  plaintext: string

  async hash(plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return this.digest
  }
}

export class HashComparerSpy implements HashComparer {
  plaintext: string
  digest: string
  isValid = true

  async compare(plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext
    this.digest = digest
    return this.isValid
  }
}

export class EncrypterSpy implements Encrypter {
  ciphertext = faker.datatype.uuid()
  payload: string
  expiresIn: number

  token: string
  decryptedPayload = {
    id: faker.datatype.uuid(),
    email: faker.internet.email(),
    iat: faker.datatype.number(),
    exp: faker.datatype.number()
  }

  async encrypt(payload: string, expiresIn: number): Promise<string> {
    this.payload = payload
    this.expiresIn = expiresIn
    return this.ciphertext
  }

  async verify(token: string): Promise<Encrypter.Payload> {
    this.token = token
    return this.decryptedPayload
  }
}
