import { MongoHelper } from '@/infra/db'
import { LoadTestResultsRepository } from '@/data/protocols'
import { TestResultModel, StatusTestResult } from '@/domain/models'

export class TestResultMongoRepository implements LoadTestResultsRepository {
  async findOrCreate (accountId: string, challengeId: string): Promise<TestResultModel> {
    const testResultsCollection = await MongoHelper.getCollection('test-results')
    let result = await testResultsCollection.findOne({ accountId, challengeId })
    if (result) {
      return MongoHelper.map(result)
    }
    const newTestResult = {
      accountId,
      challengeId,
      status: StatusTestResult.STARTED
    }
    result = await testResultsCollection.insertOne(newTestResult)
    return MongoHelper.map(result.ops[0])
  }
}
