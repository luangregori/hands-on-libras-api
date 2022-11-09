import { AchievementModel } from '@/domain/models'

export interface LoadUserInfo {
  load: (accountId: string) => Promise<LoadUserInfo.Result>
}

export namespace LoadUserInfo {
  export interface Result {
    name: string
    image_url?: string
    achievements: AchievementModel[]
  }
}
