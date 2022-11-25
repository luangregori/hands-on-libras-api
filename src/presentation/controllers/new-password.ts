import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError, badRequest } from '@/presentation/helpers/http-helper'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { UpdateAccount } from '@/domain/usecases'

export class NewPasswordController implements Controller {
  constructor (
    private readonly updateAccount: UpdateAccount
  ) { }

  async handle (request: NewPasswordController.Request): Promise<HttpResponse> {
    try {
      const requiredFields = ['code', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { code, accountId, password, passwordConfirmation } = request

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const updateAccountParams: UpdateAccount.Params = {
        oldPassword: code,
        newPassword: password
      }

      await this.updateAccount.updateById(accountId, updateAccountParams)
      return ok()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace NewPasswordController {
  export interface Request extends Controller.Request {
    code: string
    password: string
    passwordConfirmation: string
  }
}
