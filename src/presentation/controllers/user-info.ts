import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers/http-helper'
import { LoadRanking, LoadUserInfo, LoadUserScore } from '@/domain/usecases'

export class UserInfoController implements Controller {
  constructor (
    private readonly loadUserInfo: LoadUserInfo,
    private readonly loadUserScore: LoadUserScore,
    private readonly loadRanking: LoadRanking
  ) { }

  async handle (request: UserInfoController.Request): Promise<HttpResponse> {
    try {
      const { accountId } = request
      const userInfo = await this.loadUserInfo.load(accountId)
      const userScore = await this.loadUserScore.load(accountId)
      const userRanking = await this.loadRanking.load({ days: 7 })
      const userPosition = userRanking.find(user => user.id.toString() === accountId)?.position
      return ok({ userInfo, userScore, userPosition })
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace UserInfoController {
  export interface Request extends Controller.Request { }
}
