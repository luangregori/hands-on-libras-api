import { StartChallenge, FindChallengeByIdRepository, LoadTestResultsRepository } from './start-challenge-protocols'

export class DbStartChallenge implements StartChallenge {
  constructor (
    private readonly findChallengeByIdRepository: FindChallengeByIdRepository,
    private readonly loadTestResultsRepository: LoadTestResultsRepository
  ) {}

  async start (params: StartChallenge.Params): Promise<StartChallenge.Result> {
    const challengeInfo = await this.findChallengeByIdRepository.find(params.challengeId)

    // TODO: talvez tenha que fazer que carregar mais dados do banco?
    const userInfo = await this.loadTestResultsRepository.load(params.accountId, params.challengeId)

    return {
      challengeInfo,
      userInfo
    }
  }
}
