import bcrypt from 'bcrypt'
import { Hasher } from '@/data/protocols/hasher'
import { HashComparer } from '@/data/protocols/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare (plaintext: string, digest: string): Promise<boolean> {
    return await bcrypt.compare(plaintext, digest)
  }
}
