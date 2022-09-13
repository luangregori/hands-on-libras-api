import { LoadUserScore } from '@/domain/usecases'
import { LoadTestResultsRepository } from '@/data/protocols'

export class DbLoadUserScore implements LoadUserScore {
  constructor (
    private readonly loadTestResultsRepository: LoadTestResultsRepository
  ) {}

  async load (accountId: string): Promise<number> {
    const results = await this.loadTestResultsRepository.findByAccountId(accountId)
    const sum = results.reduce((acc, result) => acc + result.score, 0)
    return sum
  }
}
