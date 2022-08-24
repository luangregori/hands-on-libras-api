import jwt from 'jsonwebtoken'
import { Encrypter } from '@/data/protocols'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secret: string) {}

  async encrypt (payload: any, expiresIn: number): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn })
  }

  async verify (token: string): Promise<any> {
    return jwt.verify(token, this.secret)
  }
}
