import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '@/data/protocols'
import { FindAccountRepository } from '@/data/protocols/'
import { AccountModel } from '@/domain/models'
import { MongoHelper } from '@/infra/db'

export class AccountMongoRepository implements AddAccountRepository, FindAccountRepository {
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
}
