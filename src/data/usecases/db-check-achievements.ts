import { CheckAchievements } from '@/domain/usecases'
import {
  LoadChallengeResultsRepository,
  AddAchievementRepository
} from '@/data/protocols'

export interface Achievement {
  id: string
  period: number
  name: string
  quantity?: number
  score?: number
  icon: string
}

export class DbCheckAchievements implements CheckAchievements {
  private readonly frequency_achievements: Achievement[] = [
    { id: '0', period: 1, quantity: 1, name: '1° curso concluído', icon: '' },
    { id: '1', period: 7, quantity: 3, name: '3 cursos em uma semana', icon: '' },
    { id: '2', period: 7, quantity: 5, name: '5 cursos em uma semana', icon: '' },
    { id: '3', period: 30, quantity: 10, name: '10 cursos em um mes', icon: '' },
    { id: '4', period: 7, score: 1000, name: '1000 pontos em uma semana', icon: '' }
  ]

  constructor (
    private readonly loadChallengeResultsRepository: LoadChallengeResultsRepository,
    private readonly addAchievementRepository: AddAchievementRepository
  ) { }

  async check (accountId: string): Promise<void> {
    const now = new Date()

    for await (const achievement of this.frequency_achievements) {
      const dateToCompare = new Date(now.setDate(now.getDate() - achievement.period))
      const results = await this.loadChallengeResultsRepository.findByDateAndAccountId(dateToCompare, accountId)

      if (achievement.quantity && results.length >= achievement.quantity) {
        this.buildAndAddAchievement(accountId, achievement)
      }

      if (achievement.score && results.length >= achievement.score) {
        this.buildAndAddAchievement(accountId, achievement)
      }
    }
  }

  private buildAndAddAchievement (accountId: string, achievement: Achievement): void {
    void this.addAchievementRepository.findOrCreate(accountId, {
      id: achievement.id,
      accountId,
      name: achievement.name,
      icon: achievement.icon
    })
  }
}
