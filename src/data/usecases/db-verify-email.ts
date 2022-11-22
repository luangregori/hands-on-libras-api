import { VerifyEmail } from '@/domain/usecases'
import { FindAccountRepository, UpdateAccountRepository } from '@/data/protocols'

export class DbVerifyEmail implements VerifyEmail {
  constructor (
    private readonly findAccountRepository: FindAccountRepository,
    private readonly updateAccountRepository: UpdateAccountRepository
  ) { }

  async verify (accountId: string): Promise<boolean> {
    try {
      const account = await this.findAccountRepository.findById(accountId)
      if (!account) {
        return false
      }
    } catch (error) {
      if (error.message.includes('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')) {
        return false
      }
    }

    const updatedAccount = await this.updateAccountRepository.updateById(accountId, { email_verified: true })

    return !!updatedAccount
  }
}
