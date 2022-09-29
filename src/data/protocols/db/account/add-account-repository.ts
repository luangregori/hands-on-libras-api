import { AddAccount } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'

export interface AddAccountRepository{
  add: (accountData: AddAccountRepository.Params) => Promise<AccountModel>
}

export namespace AddAccountRepository {
  export type Params = AddAccount.Params
}
