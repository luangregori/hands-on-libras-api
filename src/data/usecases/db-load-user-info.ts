import { LoadUserInfo } from '@/domain/usecases'
import { FindAccountRepository } from '@/data/protocols'

export class DbLoadUserInfo implements LoadUserInfo {
  constructor (
    private readonly findAccountRepository: FindAccountRepository
  ) { }

  async load (accountId: string): Promise<LoadUserInfo.Result> {
    const userInfo = await this.findAccountRepository.findById(accountId)
    const { password, ...userWithOutPass } = userInfo

    // TODO: buscar as conquistas do usuário
    const achievements = ['EXEMPLO DE CONQUISTA']

    return Object.assign({}, userWithOutPass, { achievements })
  }
}
