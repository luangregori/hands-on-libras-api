import { UpdateAccount } from '@/domain/usecases'
import { FindAccountRepository, HashComparer, Hasher, UpdateAccountRepository } from '@/data/protocols'

export class DbUpdateAccount implements UpdateAccount {
  constructor (
    private readonly findAccountRepository: FindAccountRepository,
    private readonly hashComparer: HashComparer,
    private readonly updateAccountRepository: UpdateAccountRepository,
    private readonly hasher: Hasher
  ) { }

  async updateById (accountId: string, params: UpdateAccount.Params): Promise<UpdateAccount.Result> {
    if (params.newPassword) {
      const account = await this.findAccountRepository.findById(accountId)
      const isValid = await this.hashComparer.compare(params.oldPassword, account.password)
      if (!isValid) {
        throw new Error('Invalid password')
      }
      const hashedPassword = await this.hasher.hash(params.newPassword)
      params = { ...params, password: hashedPassword } as any
      delete params.oldPassword
      delete params.newPassword
    }

    const updatedAccount = await this.updateAccountRepository.updateById(accountId, params)
    delete updatedAccount.password
    return updatedAccount
  }
}
