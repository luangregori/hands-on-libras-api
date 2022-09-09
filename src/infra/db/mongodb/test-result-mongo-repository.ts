import { MongoHelper } from '@/infra/db'
import { LoadTestResultsRepository, UpdateTestResultRepository } from '@/data/protocols'
import { TestResultModel, StatusTestResult } from '@/domain/models'

export class TestResultMongoRepository implements LoadTestResultsRepository, UpdateTestResultRepository {
  async findOrCreate (accountId: string, challengeId: string): Promise<TestResultModel> {
    const testResultsCollection = await MongoHelper.getCollection('test-results')
    let result = await testResultsCollection.findOne({ accountId, challengeId })
    if (result) {
      return MongoHelper.map(result)
    }
    const newTestResult = {
      accountId,
      challengeId,
      status: StatusTestResult.STARTED,
      score: 0,
      updatedAt: new Date()
    }
    result = await testResultsCollection.insertOne(newTestResult)
    return MongoHelper.map(result.ops[0])
  }

  async findByDate (date: Date): Promise<TestResultModel[]> {
    const testResultsCollection = await MongoHelper.getCollection('test-results')
    const result = await testResultsCollection.find({
      updatedAt: {
        $gte: date
      }
    }).limit(20).toArray()
    return result.map(MongoHelper.map)
  }

  async update (accountId: string, challengeId: string, updateTestResult: any): Promise<TestResultModel> {
    const testResultsCollection = await MongoHelper.getCollection('test-results')
    const set = { updatedAt: new Date() }

    for (const field in updateTestResult) {
      set[field] = updateTestResult[field]
    }

    const result = await testResultsCollection.findOneAndUpdate({ accountId, challengeId }, { $set: set }, { returnOriginal: false })
    if (result.ok) return MongoHelper.map(result.value)
  }
}
