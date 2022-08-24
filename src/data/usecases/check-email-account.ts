import { FindAccountByEmailRepository } from '@/data/protocols'
import { CheckEmailAccount } from '@/domain/usecases'

export class DbCheckEmailAccount implements CheckEmailAccount {
  constructor (
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository
  ) {}

  async check (email: string): Promise<boolean> {
    const account = await this.findAccountByEmailRepository.find(email)
    return !!account
  }
}
