import { AddAccountRepository } from '@/data/protocols'
import { FindAccountByEmailRepository } from '@/data/protocols/'
import { AddAccountModel } from '@/domain/usecases/add-account'
import { AccountModel } from '@/domain/models'
import { MongoHelper } from '@/infra/db'

export class AccountMongoRepository implements AddAccountRepository, FindAccountByEmailRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.map(result.ops[0])
  }

  async find (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({ email })
    if (result) return MongoHelper.map(result)
  }
}
