import { ObjectId } from 'mongodb'
import { FindAllChallengesRepository, FindChallengesByCategoryIdRepository, FindChallengeByIdRepository } from '@/data/protocols'
import { ChallengeModel } from '@/domain/models'
import { MongoHelper } from '@/infra/db'

export class ChallengeMongoRepository implements FindAllChallengesRepository, FindChallengesByCategoryIdRepository, FindChallengeByIdRepository {
  async findAll (): Promise<ChallengeModel[]> {
    const challengeCollection = await MongoHelper.getCollection('challenges')
    const result = await challengeCollection.find({}).toArray()
    return result.length ? result.map(category => MongoHelper.map(category)) : result
  }

  async findByCategoryId (categoryId: string): Promise<ChallengeModel[]> {
    const challengeCollection = await MongoHelper.getCollection('challenges')
    const result = await challengeCollection.find({ categoryId }).toArray()
    return result.length ? result.map(category => MongoHelper.map(category)) : result
  }

  async findById (challengeId: string): Promise<ChallengeModel> {
    const challengeCollection = await MongoHelper.getCollection('challenges')
    const result = await challengeCollection.findOne({ _id: new ObjectId(challengeId) })
    if (result) return MongoHelper.map(result)
  }
}
