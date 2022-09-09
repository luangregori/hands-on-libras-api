import { AccountModel } from '@/domain/models'

export interface FindAccountRepository{
  findByEmail: (email: string) => Promise<AccountModel>
  findById: (accountId: string) => Promise<AccountModel>
}
