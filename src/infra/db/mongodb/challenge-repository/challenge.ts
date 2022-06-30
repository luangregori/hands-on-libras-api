import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { FindAllChallengesRepository } from '@/data/protocols/find-all-challenges-repository'
import { FindChallengesByCategoryIdRepository } from '@/data/protocols/find-challenges-by-category-id-repository'
import { ChallengeModel } from '@/domain/models/challenge'

export class ChallengeMongoRepository implements FindAllChallengesRepository, FindChallengesByCategoryIdRepository {
  async findAll (): Promise<ChallengeModel[]> {
    const challengeCollection = await MongoHelper.getCollection('challenges')
    const result = await challengeCollection.find({}).toArray()
    return result.length ? result.map(category => MongoHelper.map(category)) : result
  }

  async findbyId (categoryId: string): Promise<ChallengeModel[]> {
    const challengeCollection = await MongoHelper.getCollection('challenges')
    const result = await challengeCollection.find({ categoryId }).toArray()
    return result.length ? result.map(category => MongoHelper.map(category)) : result
  }
}
