import { LoadUserInfo } from '@/domain/usecases'
import { FindAccountRepository, FindAchievementsRepository } from '@/data/protocols'

export class DbLoadUserInfo implements LoadUserInfo {
  constructor (
    private readonly findAccountRepository: FindAccountRepository,
    private readonly findAchievementsRepository: FindAchievementsRepository
  ) { }

  async load (accountId: string): Promise<LoadUserInfo.Result> {
    const userInfo = await this.findAccountRepository.findById(accountId)
    const { password, ...userWithOutPass } = userInfo

    const achievements = await this.findAchievementsRepository.find(accountId)

    return Object.assign({}, userWithOutPass, { achievements })
  }
}
