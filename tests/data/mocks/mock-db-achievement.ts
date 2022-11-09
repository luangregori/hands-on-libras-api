import { AddAchievementRepository, FindAchievementsRepository } from '@/data/protocols'
import { AchievementModel } from '@/domain/models'
import { mockAchievementModel } from '@/tests/domain/mocks'

export class AddAchievementRepositorySpy implements AddAchievementRepository {
  accountId: string
  achievementModel: AchievementModel
  result = true

  async findOrCreate (accountId: string, achievementModel: AchievementModel): Promise<boolean> {
    this.accountId = accountId
    this.achievementModel = achievementModel
    return this.result
  }
}

export class FindAchievementsRepositorySpy implements FindAchievementsRepository {
  accountId: string
  result = [mockAchievementModel()]

  async find (accountId: string): Promise<AchievementModel[]> {
    this.accountId = accountId
    return this.result
  }
}
