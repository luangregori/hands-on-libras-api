import { AchievementModel } from '@/domain/models'

export interface AddAchievementRepository {
  findOrCreate: (accountId: string, achievementModel: AchievementModel) => Promise<boolean>
}
