import { CompleteLearn } from '@/domain/usecases'
import { UpdateChallengeResultRepository, LoadChallengeResultsRepository } from '@/data/protocols'
import { StatusChallengeResult } from '@/domain/models'

export class DbCompleteLearn implements CompleteLearn {
  constructor (
    private readonly loadChallengeResultsRepository: LoadChallengeResultsRepository,
    private readonly updateChallengeResultRepository: UpdateChallengeResultRepository
  ) { }

  async complete (completeLearnParams: CompleteLearn.Params): Promise<boolean> {
    const { accountId, lessonId } = completeLearnParams
    const challengeResult = await this.loadChallengeResultsRepository.findOrCreate(accountId, lessonId)
    if (challengeResult.status === StatusChallengeResult.STARTED) {
      const challengeResultToUpdate = {
        status: StatusChallengeResult.LEARNED,
        score: challengeResult.score + 10
      }
      await this.updateChallengeResultRepository.update(accountId, lessonId, challengeResultToUpdate)
    }
    return true
  }
}
