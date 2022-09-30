import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers/http-helper'
import { LoadUserInfo } from '@/domain/usecases'

export class UserInfoController implements Controller {
  constructor (
    private readonly loadUserInfo: LoadUserInfo
  ) { }

  async handle (request: UserInfoController.Request): Promise<HttpResponse> {
    try {
      const infos = await this.loadUserInfo.load(request.accountId)
      return ok(infos)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace UserInfoController {
  export interface Request extends Controller.Request { }
}
