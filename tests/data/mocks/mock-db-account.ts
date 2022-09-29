import { AddAccountRepository, FindAccountRepository } from '@/data/protocols'
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

export class FindAccountRepositorySpy implements FindAccountRepository {
  email: string
  id: string
  result = mockAccountModel()

  async findByEmail (email: string): Promise<AccountModel> {
    this.email = email
    return this.result
  }

  async findById (id: string): Promise<AccountModel> {
    this.id = id
    return this.result
  }
}
