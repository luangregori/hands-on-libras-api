import { StartChallenge } from '@/domain/usecases'
import { FindChallengeByIdRepository, LoadTestResultsRepository } from '@/data/protocols'

export class DbStartChallenge implements StartChallenge {
  constructor (
    private readonly findChallengeByIdRepository: FindChallengeByIdRepository,
    private readonly loadTestResultsRepository: LoadTestResultsRepository
  ) {}

  async start (params: StartChallenge.Params): Promise<StartChallenge.Result> {
    const challengeInfo = await this.findChallengeByIdRepository.findById(params.challengeId)

    const userInfo = await this.loadTestResultsRepository.findOrCreate(params.accountId, params.challengeId)

    return {
      challengeInfo,
      userInfo
    }
  }
}
