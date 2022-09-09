import { LoadRanking } from '@/domain/usecases'
import { LoadTestResultsRepository, FindAccountRepository } from '@/data/protocols'
export class DbLoadRanking implements LoadRanking {
  constructor (
    private readonly loadTestResultsRepository: LoadTestResultsRepository,
    private readonly findAccountRepository: FindAccountRepository
  ) { }

  async load (loadRankingParams: LoadRanking.Params): Promise<LoadRanking.Result[]> {
    const now = new Date()
    const dateToCompare = new Date(now.setDate(now.getDate() - loadRankingParams.days))
    const results = await this.loadTestResultsRepository.findByDate(loadRankingParams.accountId, dateToCompare)

    const ranking: LoadRanking.Result[] = []

    const inOrderRanking = results.sort((a, b) => { return b.score - a.score })

    let position = 1
    for (const result of inOrderRanking) {
      const account = await this.findAccountRepository.findById(result.accountId)
      ranking.push({
        position,
        name: account.name,
        score: result.score
      })
      position++
    }

    return ranking
  }
}
