import { FindAccountByEmailRepository, CheckEmailAccount } from './check-email-account-protocols'

export class DbCheckEmailAccount implements CheckEmailAccount {
  private readonly findAccountByEmailRepository: FindAccountByEmailRepository

  constructor (findAccountByEmailRepository: FindAccountByEmailRepository) {
    this.findAccountByEmailRepository = findAccountByEmailRepository
  }

  async check (email: string): Promise<boolean> {
    const account = await this.findAccountByEmailRepository.find(email)
    return !!account
  }
}
