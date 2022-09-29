import { LearnLesson } from '@/domain/usecases'
import { FindLearningInfoRepository } from '@/data/protocols'

export class DbLearnLesson implements LearnLesson {
  constructor (
    private readonly findLearningInfoRepository: FindLearningInfoRepository
  ) {}

  async learn (lessonId: string): Promise<LearnLesson.Result> {
    return await this.findLearningInfoRepository.findByLessonId(lessonId)
  }
}
