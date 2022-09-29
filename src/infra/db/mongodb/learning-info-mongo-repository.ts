import { FindLearningInfoRepository } from '@/data/protocols'
import { LearningInfoModel } from '@/domain/models'
import { MongoHelper } from '@/infra/db'

export class LearningInfoMongoRepository implements FindLearningInfoRepository {
  async findByLessonId (lessonId: string): Promise<LearningInfoModel[]> {
    const learningInfoCollection = await MongoHelper.getCollection('learning-infos')
    const result = await learningInfoCollection.find({ lessonId }).toArray()
    return result.length ? result.map(el => MongoHelper.map(el)) : result
  }
}
