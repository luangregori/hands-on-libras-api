import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError, badRequest, unauthorized } from '@/presentation/helpers/http-helper'
import { MissingParamError } from '@/presentation/errors'
import { Authentication } from '@/domain/usecases'

export class ConfirmCodeController implements Controller {
  constructor (
    private readonly authentication: Authentication
  ) { }

  async handle (request: ConfirmCodeController.Request): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'code']
      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const authenticationParams: Authentication.Params = {
        email: request.email,
        password: request.code
      }

      const authenticationModel = await this.authentication.auth(authenticationParams)
      if (!authenticationModel) {
        return unauthorized()
      }

      return ok(authenticationModel)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace ConfirmCodeController {
  export interface Request extends Controller.Request {
    email: string
    code: string
  }
}
