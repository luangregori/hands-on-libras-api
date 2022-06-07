import { Authentication, FindAccountByEmailRepository, HashComparer, Encrypter } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}

  async auth (authenticationParams: Authentication.Params): Promise<Authentication.Result> {
    const account = await this.findAccountByEmailRepository.find(authenticationParams.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authenticationParams.password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt({ id: account.id, email: account.email })
        return {
          accessToken,
          name: account.name
        }
      }
    }
    return null
  }
}
