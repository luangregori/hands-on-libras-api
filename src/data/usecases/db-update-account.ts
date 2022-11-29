import { UpdateAccount } from '@/domain/usecases'
import { FindAccountRepository, HashComparer, Hasher, UpdateAccountRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models'

export class DbUpdateAccount implements UpdateAccount {
  constructor(
    private readonly findAccountRepository: FindAccountRepository,
    private readonly hashComparer: HashComparer,
    private readonly updateAccountRepository: UpdateAccountRepository,
    private readonly hasher: Hasher
  ) { }

  async updateById(accountId: string, params: UpdateAccount.Params): Promise<UpdateAccount.Result> {
    const account = await this.findAccountRepository.findById(accountId)
    if (params.newPassword) {
      const isValid = await this.hashComparer.compare(params.oldPassword, account.password)
      if (!isValid) {
        throw new Error('Invalid password')
      }
      const hashedPassword = await this.hasher.hash(params.newPassword)
      params = { ...params, password: hashedPassword } as any
      delete params.oldPassword
      delete params.newPassword
    }
    params = this.checkNewEmail(account, params)

    const updatedAccount = await this.updateAccountRepository.updateById(accountId, params)
    delete updatedAccount.password
    return updatedAccount
  }

  private checkNewEmail(account: AccountModel, params: UpdateAccount.Params): UpdateAccount.Params {
    if (params.email && params.email !== account.email) {
      params.email_verified = false
    }
    return params
  }
}
