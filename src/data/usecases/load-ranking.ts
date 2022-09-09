import { LoadRanking } from '@/domain/usecases'
import { LoadTestResultsRepository } from '@/data/protocols'
export class DbLoadRanking implements LoadRanking {
  constructor (
    private readonly loadTestResultsRepository: LoadTestResultsRepository
  ) { }

  async load (loadRankingParams: LoadRanking.Params): Promise<LoadRanking.Result[]> {
    const now = new Date()
    const dateToCompare = new Date(now.setDate(now.getDate() - loadRankingParams.days))
    const results = await this.loadTestResultsRepository.findByDate(loadRankingParams.accountId, dateToCompare)

    const ranking: LoadRanking.Result[] = []

    const inOrderRanking = results.sort((a, b) => { return b.score - a.score })

    inOrderRanking.forEach((value, index) => {
      // TODO: search the name of the user in the database using value.accountId
      const name = 'test'
      ranking.push({
        position: index + 1,
        score: value.score,
        name
      })
    })

    return ranking
  }
}
