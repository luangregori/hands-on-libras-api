import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { LoadTestResultsRepository } from '@/data/protocols/load-test-results-repository'
import { TestResultModel } from '@/domain/models/test-result'

export class TestResultMongoRepository implements LoadTestResultsRepository {
  async load (accountId: string, challengeId: string): Promise<TestResultModel> {
    const testResultsCollection = await MongoHelper.getCollection('test-results')
    const result = await testResultsCollection.findOne({ accountId, challengeId })
    if (result) return MongoHelper.map(result)
  }
}
