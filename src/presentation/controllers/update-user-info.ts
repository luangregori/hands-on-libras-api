import { Controller, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { UpdateAccount } from '@/domain/usecases'
import { MissingParamError } from '../errors'

export class UpdateUserInfoController implements Controller {
  constructor (
    private readonly updateAccount: UpdateAccount
  ) { }

  async handle (request: UpdateUserInfoController.Request): Promise<HttpResponse> {
    try {
      if (request.newPassword && !request.oldPassword) {
        return badRequest(new MissingParamError('oldPassword'))
      }

      const { accountId, ...params } = request
      const userInfo = await this.updateAccount.updateById(accountId, params)
      return ok(userInfo)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace UpdateUserInfoController {
  export interface Request extends Controller.Request {
    name?: string
    email?: string
    image_url?: string
    oldPassword?: string
    newPassword?: string
  }
}
