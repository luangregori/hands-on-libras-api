import { LoadRanking } from '@/domain/usecases'
import { LoadChallengeResultsRepository, FindAccountRepository } from '@/data/protocols'
import { ChallengeResultModel } from '@/domain/models'
export class DbLoadRanking implements LoadRanking {
  constructor (
    private readonly loadChallengeResultsRepository: LoadChallengeResultsRepository,
    private readonly findAccountRepository: FindAccountRepository
  ) { }

  async load (loadRankingParams: LoadRanking.Params): Promise<LoadRanking.Result[]> {
    // 1. Diminui a quantidade de dias e faz a busca pelos TEST-RESULTS
    const now = new Date()
    const dateToCompare = new Date(now.setDate(now.getDate() - loadRankingParams.days))
    const results = await this.loadChallengeResultsRepository.findByDate(dateToCompare)

    // 2. Agrupa os resultados por ACCOUNT-ID
    const groupsByAccountId = results.reduce((groups, item) => ({
      ...groups,
      [item.accountId]: [...(groups[item.accountId] || []), item]
    }), {})

    const ranking: LoadRanking.Result[] = []

    // 3. Para cada grupo, calcula a pontuação e busca o ACCOUNT
    for (const [key, value] of Object.entries(groupsByAccountId)) {
      const account = await this.findAccountRepository.findById(key)
      const results = value as ChallengeResultModel[]
      const scoreSum = results.reduce((previousValue, currentValue) => previousValue + currentValue.score, 0)
      ranking.push({
        position: 0,
        name: account.name,
        score: scoreSum
      })
    }

    // 4. Ordena o ranking por pontuação
    const inOrderRanking = ranking.sort((a, b) => { return b.score - a.score })

    // 5. Adiciona a posição no ranking
    let position = 1
    for (const result of inOrderRanking) {
      result.position = position
      position++
    }

    return ranking
  }
}
