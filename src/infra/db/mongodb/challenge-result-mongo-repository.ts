import { MongoHelper } from '@/infra/db'
import { LoadChallengeResultsRepository, UpdateChallengeResultRepository } from '@/data/protocols'
import { ChallengeResultModel, StatusChallengeResult } from '@/domain/models'

export class ChallengeResultMongoRepository implements LoadChallengeResultsRepository, UpdateChallengeResultRepository {
  async findOrCreate (accountId: string, lessonId: string): Promise<ChallengeResultModel> {
    const challengeResultsCollection = await MongoHelper.getCollection('challenge-results')
    let result = await challengeResultsCollection.findOne({ accountId, lessonId })
    if (result) {
      return MongoHelper.map(result)
    }
    const newChallengeResult = {
      accountId,
      lessonId,
      status: StatusChallengeResult.STARTED,
      score: 0,
      updatedAt: new Date()
    }
    result = await challengeResultsCollection.insertOne(newChallengeResult)
    return MongoHelper.map(result.ops[0])
  }

  async findByDate (date: Date): Promise<ChallengeResultModel[]> {
    const challengeResultsCollection = await MongoHelper.getCollection('challenge-results')
    const result = await challengeResultsCollection.find({
      updatedAt: {
        $gte: date
      }
    }).limit(20).toArray()
    return result.map(MongoHelper.map)
  }

  async findByDateAndAccountId (date: Date, accountId: string): Promise<ChallengeResultModel[]> {
    const challengeResultsCollection = await MongoHelper.getCollection('challenge-results')
    const result = await challengeResultsCollection.find({
      updatedAt: {
        $gte: date
      },
      accountId,
      status: StatusChallengeResult.COMPLETED
    }).toArray()
    return result.map(MongoHelper.map)
  }

  async findByAccountId (accountId: string): Promise<ChallengeResultModel[]> {
    const challengeResultsCollection = await MongoHelper.getCollection('challenge-results')
    const result = await challengeResultsCollection.find({ accountId }).toArray()
    return result.map(MongoHelper.map)
  }

  async update (accountId: string, lessonId: string, updateChallengeResult: any): Promise<ChallengeResultModel> {
    const challengeResultsCollection = await MongoHelper.getCollection('challenge-results')
    const set = { updatedAt: new Date() }

    for (const field in updateChallengeResult) {
      set[field] = updateChallengeResult[field]
    }

    const result = await challengeResultsCollection.findOneAndUpdate({ accountId, lessonId }, { $set: set }, { returnOriginal: false })
    if (result.ok) return MongoHelper.map(result.value)
  }
}
