import { CompleteChallenge } from '@/domain/usecases'
import { UpdateChallengeResultRepository, LoadChallengeResultsRepository } from '@/data/protocols'
import { StatusChallengeResult } from '@/domain/models'

export class DbCompleteChallenge implements CompleteChallenge {
  constructor (
    private readonly loadChallengeResultsRepository: LoadChallengeResultsRepository,
    private readonly updateChallengeResultRepository: UpdateChallengeResultRepository
  ) { }

  async complete (completeChallengeParams: CompleteChallenge.Params): Promise<boolean> {
    const { accountId, lessonId, lives } = completeChallengeParams
    const challengeResult = await this.loadChallengeResultsRepository.findOrCreate(accountId, lessonId)
    // Se ja completou o desafio, não dá mais pontos
    if (challengeResult.status === StatusChallengeResult.COMPLETED) {
      return true
    }

    // Se acabou as vidas, reverte o status e não da pontos
    if (challengeResult.status === StatusChallengeResult.TESTED && lives === 0) {
      challengeResult.status = StatusChallengeResult.LEARNED
      await this.updateChallengeResultRepository.update(accountId, lessonId, challengeResult)
      return true
    }

    // Da pontuação conforme a quantidade de vidas
    challengeResult.status = lives === 3 ? StatusChallengeResult.COMPLETED : StatusChallengeResult.TESTED
    challengeResult.score += lives === 3 ? 90 : lives * 30
    await this.updateChallengeResultRepository.update(accountId, lessonId, challengeResult)
    return true
  }
}
