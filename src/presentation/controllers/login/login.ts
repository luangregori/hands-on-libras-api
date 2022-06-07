import { HttpResponse, HttpRequest, Controller, Authentication } from './login-protocols'
import { MissingParamError } from '../../erros'
import { badRequest, serverError, ok, unauthorized } from '../../helpers/http-helper'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const authenticationParams: Authentication.Params = httpRequest.body

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
