import { Hasher, AddAccountRepository } from '@/data/protocols'
import { AddAccount } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) { }

  async add(accountData: AddAccount.Params): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}
