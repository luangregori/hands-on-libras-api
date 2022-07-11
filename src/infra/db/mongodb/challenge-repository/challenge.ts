import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { FindAllChallengesRepository } from '@/data/protocols/find-all-challenges-repository'
import { FindChallengesByCategoryIdRepository } from '@/data/protocols/find-challenges-by-category-id-repository'
import { FindChallengeByIdRepository } from '@/data/protocols/find-challenge-by-id-repository'
import { ChallengeModel } from '@/domain/models/challenge'
import { ObjectId } from 'mongodb'

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
