import { AddAccountRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/tests/domain/mocks'

export class AddAccountRepositorySpy implements AddAccountRepository {
  params: AddAccountRepository.Params
  result = mockAccountModel()

  async add (params: AddAccountRepository.Params): Promise<AccountModel> {
    this.params = params
    return this.result
  }
}