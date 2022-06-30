import { HttpResponse, Controller, Authentication } from './login-protocols'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, serverError, ok, unauthorized } from '@/presentation/helpers/http-helper'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication
  ) {}

  async handle (request: LoginController.Request): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const authenticationParams: Authentication.Params = request

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

export namespace LoginController {
  export interface Request {
    email: string
    password: string
  }
}
