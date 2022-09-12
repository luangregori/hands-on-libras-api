import { FindAccountRepository, HashComparer, Encrypter } from '@/data/protocols'
import { Authentication } from '@/domain/usecases'
import env from '@/main/config/env'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly findAccountRepository: FindAccountRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}

  async auth (authenticationParams: Authentication.Params): Promise<Authentication.Result> {
    const account = await this.findAccountRepository.findByEmail(authenticationParams.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authenticationParams.password, account.password)
      if (isValid) {
        const expiresIn = Number(env.jwtExpiresIn)
        const accessToken = await this.encrypter.encrypt({ id: account.id, email: account.email }, expiresIn)
        return {
          accessToken,
          expiresIn,
          name: account.name
        }
      }
    }
    return null
  }
}
