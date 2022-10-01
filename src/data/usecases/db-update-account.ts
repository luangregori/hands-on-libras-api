import { UpdateAccount } from '@/domain/usecases'
import { FindAccountRepository, HashComparer, UpdateAccountRepository } from '@/data/protocols'

export class DbUpdateAccount implements UpdateAccount {
  constructor (
    private readonly findAccountRepository: FindAccountRepository,
    private readonly hashComparer: HashComparer,
    private readonly updateAccountRepository: UpdateAccountRepository
  ) { }

  async updateById (accountId: string, params: UpdateAccount.Params): Promise<UpdateAccount.Result> {
    if (params.newPassword) {
      const account = await this.findAccountRepository.findById(accountId)
      const isValid = await this.hashComparer.compare(params.oldPassword, account.password)
      if (!isValid) {
        throw new Error('Invalid password')
      }
      params = { ...params, password: params.newPassword } as any
      delete params.oldPassword
      delete params.newPassword
    }

    return await this.updateAccountRepository.updateById(accountId, params)
  }
}
