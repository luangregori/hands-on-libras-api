import { AchievementModel } from '@/domain/models'

export interface FindAchievementsRepository {
  find: (accountId: string) => Promise<AchievementModel[]>
}
