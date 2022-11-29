import { Controller, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { UpdateAccount } from '@/domain/usecases'
import { InvalidPasswordError, MissingParamError } from '../errors'

export class UpdateUserInfoController implements Controller {
  constructor (
    private readonly updateAccount: UpdateAccount
  ) { }

  async handle (request: UpdateUserInfoController.Request): Promise<HttpResponse> {
    try {
      if (request.newPassword && !request.oldPassword) {
        return badRequest(new MissingParamError('oldPassword'))
      }

      const protectedFields = ['id', '_id', 'password']
      for (const field of protectedFields) {
        if (request[field]) {
          delete request[field]
        }
      }

      const { accountId, ...params } = request
      const userInfo = await this.updateAccount.updateById(accountId, params)
      return ok(userInfo)
    } catch (error) {
      if (error instanceof InvalidPasswordError) {
        return badRequest(error)
      }
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
    password?: string
  }
}
