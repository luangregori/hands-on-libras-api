import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers/http-helper'
import { LoadUserInfo, LoadUserScore } from '@/domain/usecases'

export class UserInfoController implements Controller {
  constructor (
    private readonly loadUserInfo: LoadUserInfo,
    private readonly loadUserScore: LoadUserScore
  ) { }

  async handle (request: UserInfoController.Request): Promise<HttpResponse> {
    try {
      const { accountId } = request
      const userInfo = await this.loadUserInfo.load(accountId)
      const userScore = await this.loadUserScore.load(accountId)
      return ok({ userInfo, userScore })
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace UserInfoController {
  export interface Request extends Controller.Request { }
}
