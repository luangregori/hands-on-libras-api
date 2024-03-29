import { UpdateAccount } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'

export interface UpdateAccountRepository {
  updateById: (accountId: string, accountData: UpdateAccountRepository.Params) => Promise<AccountModel>
  updatePasswordByEmail: (email: string, password: string) => Promise<AccountModel>
}

export namespace UpdateAccountRepository {
  export type Params = UpdateAccount.Params
}
