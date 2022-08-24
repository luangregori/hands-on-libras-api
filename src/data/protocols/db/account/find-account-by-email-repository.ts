import { AccountModel } from '@/domain/models'

export interface FindAccountByEmailRepository{
  find: (email: string) => Promise<AccountModel>
}
