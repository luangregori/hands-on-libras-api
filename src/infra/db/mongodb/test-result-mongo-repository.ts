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
      score: 0
    }
    result = await testResultsCollection.insertOne(newTestResult)
    return MongoHelper.map(result.ops[0])
  }

  async update (accountId: string, challengeId: string, keyToUpdate: string, valueToUpdate: any): Promise<TestResultModel> {
    const testResultsCollection = await MongoHelper.getCollection('test-results')
    const objectToUpdate = { [keyToUpdate]: valueToUpdate }
    const result = await testResultsCollection.findOneAndUpdate({ accountId, challengeId }, { $set: objectToUpdate }, { returnOriginal: false })
    if (result.ok) return MongoHelper.map(result.value)
  }
}
