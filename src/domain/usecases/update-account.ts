import { AccountModel } from '@/domain/models'

export interface UpdateAccount{
  updateById: (accountId: string, params: UpdateAccount.Params) => Promise<UpdateAccount.Result>
}

export namespace UpdateAccount {
  export interface Params {
    name?: string
    email?: string
    image_url?: string
    oldPassword?: string
    newPassword?: string
  }

  export type Result = Omit<AccountModel, 'password'>
}
