import { FindAccountRepository } from '@/data/protocols'
import { CheckEmailAccount } from '@/domain/usecases'

export class DbCheckEmailAccount implements CheckEmailAccount {
  constructor (
    private readonly findAccountRepository: FindAccountRepository
  ) {}

  async check (email: string): Promise<boolean> {
    const account = await this.findAccountRepository.findByEmail(email)
    return !!account
  }
}
