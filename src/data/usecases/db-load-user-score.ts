import { LoadUserScore } from '@/domain/usecases'
import { LoadChallengeResultsRepository } from '@/data/protocols'

export class DbLoadUserScore implements LoadUserScore {
  constructor (
    private readonly loadChallengeResultsRepository: LoadChallengeResultsRepository
  ) {}

  async load (accountId: string): Promise<number> {
    const results = await this.loadChallengeResultsRepository.findByAccountId(accountId)
    const sum = results.reduce((acc, result) => acc + result.score, 0)
    return sum
  }
}
