import { FindAccountByEmailRepository, CheckEmailAccount } from './check-email-account-protocols'

export class DbCheckEmailAccount implements CheckEmailAccount {
  constructor (
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository
  ) {}

  async check (email: string): Promise<boolean> {
    const account = await this.findAccountByEmailRepository.find(email)
    return !!account
  }
}
