import {
  CheckAchievements
} from '@/domain/usecases'

export class CheckAchievementsSpy implements CheckAchievements {
  accountId: string

  async check (accountId: string): Promise<void> {
    this.accountId = accountId
  }
}
