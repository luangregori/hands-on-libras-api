import { ObjectId } from 'mongodb'
import { AddAccountRepository, FindAccountRepository, UpdateAccountRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models'
import { MongoHelper } from '@/infra/db'

export class AccountMongoRepository implements AddAccountRepository, FindAccountRepository, UpdateAccountRepository {
  async add (accountData: AddAccountRepository.Params): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.map(result.ops[0])
  }

  async findByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({ email })
    if (result) return MongoHelper.map(result)
  }

  async findById (accountId: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({ _id: new ObjectId(accountId) })
    if (result) return MongoHelper.map(result)
  }

  async updateById (accountId: string, accountData: any): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOneAndUpdate(
      { _id: new ObjectId(accountId) },
      { $set: accountData },
      { returnOriginal: false }
    )
    return MongoHelper.map(result.value)
  }

  async updatePasswordByEmail (email: string, password: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOneAndUpdate(
      { email },
      { $set: { password: password } },
      { returnOriginal: false }
    )
    return MongoHelper.map(result.value)
  }
}
