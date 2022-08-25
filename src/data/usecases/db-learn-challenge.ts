import { LearnChallenge } from '@/domain/usecases'
import { FindLearningInfoRepository } from '@/data/protocols'

export class DbLearnChallenge implements LearnChallenge {
  constructor (
    private readonly findLearningInfoRepository: FindLearningInfoRepository
  ) {}

  async learn (challengeId: string): Promise<LearnChallenge.Result> {
    return await this.findLearningInfoRepository.findByChallengeId(challengeId)
  }
}
