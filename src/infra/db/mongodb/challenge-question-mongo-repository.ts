import { MongoHelper } from '@/infra/db'
import { LoadChallengeQuestionRepository } from '@/data/protocols'
import { ChallengeQuestionModel } from '@/domain/models'

export class ChallengeQuestionMongoRepository implements LoadChallengeQuestionRepository {
  async findByLessonId (lessonId: string): Promise<ChallengeQuestionModel[]> {
    const testQuestionCollection = await MongoHelper.getCollection('challenge-questions')
    const result = await testQuestionCollection.find({ lessonId }).toArray()
    return result.map(MongoHelper.map)
  }
}
