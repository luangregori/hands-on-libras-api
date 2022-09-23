import { StartLesson } from '@/domain/usecases'
import { FindLessonByIdRepository, LoadChallengeResultsRepository } from '@/data/protocols'

export class DbStartLesson implements StartLesson {
  constructor (
    private readonly findLessonByIdRepository: FindLessonByIdRepository,
    private readonly loadChallengeResultsRepository: LoadChallengeResultsRepository
  ) {}

  async start (params: StartLesson.Params): Promise<StartLesson.Result> {
    const lessonInfo = await this.findLessonByIdRepository.findById(params.lessonId)

    const userInfo = await this.loadChallengeResultsRepository.findOrCreate(params.accountId, params.lessonId)

    return {
      lessonInfo,
      userInfo
    }
  }
}
