import { AuthUserByToken, Encrypter } from './auth-user-by-token-protocols'

export class AuthUser implements AuthUserByToken {
  constructor (
    private readonly encrypter: Encrypter
  ) {}

  async auth (accessToken: string): Promise<AuthUserByToken.Result> {
    try {
      const payload = await this.encrypter.verify(accessToken)
      return payload as AuthUserByToken.Result
    } catch (error) {
      return null
    }
  }
}
