import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError, badRequest } from '@/presentation/helpers/http-helper'
import { MissingParamError } from '@/presentation/errors'
import { RecoverPassword } from '@/domain/usecases'

export class RecoverPasswordController implements Controller {
  constructor (
    private readonly recoverPassword: RecoverPassword
  ) { }

  async handle (request: RecoverPasswordController.Request): Promise<HttpResponse> {
    try {
      const requiredFields = ['email']
      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      await this.recoverPassword.sendEmail(request.email)

      return ok()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace RecoverPasswordController {
  export interface Request extends Controller.Request {
    email: string
  }
}
