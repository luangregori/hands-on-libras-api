import { MongoHelper } from '@/infra/db'
import { LoadTestQuestionRepository } from '@/data/protocols'
import { TestQuestionModel } from '@/domain/models'

export class TestQuestionMongoRepository implements LoadTestQuestionRepository {
  async findByChallengeId (challengeId: string): Promise<TestQuestionModel[]> {
    const testQuestionCollection = await MongoHelper.getCollection('test-questions')
    const result = await testQuestionCollection.find({ challengeId }).toArray()
    return result.map(MongoHelper.map)
  }
}
