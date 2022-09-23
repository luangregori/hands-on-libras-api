import { ChallengeLesson } from '@/domain/usecases'
import { UpdateChallengeResultRepository, LoadChallengeQuestionRepository, LoadChallengeResultsRepository } from '@/data/protocols'
import { StatusChallengeResult } from '@/domain/models'

export class DbChallengeLesson implements ChallengeLesson {
  constructor (
    private readonly loadChallengeResultsRepository: LoadChallengeResultsRepository,
    private readonly updateChallengeResultRepository: UpdateChallengeResultRepository,
    private readonly loadChallengeQuestionRepository: LoadChallengeQuestionRepository
  ) { }

  async test (params: ChallengeLesson.Params): Promise<ChallengeLesson.Result> {
    const { accountId, lessonId } = params
    const challengeResult = await this.loadChallengeResultsRepository.findOrCreate(accountId, lessonId)

    // Se o test já for completo, não altera o status novamente
    challengeResult.status = challengeResult.status === StatusChallengeResult.COMPLETED
      ? StatusChallengeResult.COMPLETED
      : StatusChallengeResult.TESTED

    await this.updateChallengeResultRepository.update(params.accountId, params.lessonId, challengeResult)
    const questions = await this.loadChallengeQuestionRepository.findByLessonId(params.lessonId)
    return questions
  }
}
