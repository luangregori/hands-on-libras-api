import { MongoHelper } from '@/infra/db'
import { LoadTestResultsRepository } from '@/data/protocols'
import { TestResultModel } from '@/domain/models'

export class TestResultMongoRepository implements LoadTestResultsRepository {
  async load (accountId: string, challengeId: string): Promise<TestResultModel> {
    const testResultsCollection = await MongoHelper.getCollection('test-results')
    const result = await testResultsCollection.findOne({ accountId, challengeId })
    if (result) return MongoHelper.map(result)
  }
}
