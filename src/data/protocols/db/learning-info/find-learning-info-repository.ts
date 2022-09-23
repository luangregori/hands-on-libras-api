import { LearningInfoModel } from '@/domain/models'

export interface FindLearningInfoRepository {
  findByLessonId: (lessonId: string) => Promise<LearningInfoModel[]>
}
