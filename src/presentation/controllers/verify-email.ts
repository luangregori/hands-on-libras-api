import { badRequest, serverError, html, unauthorized } from '@/presentation/helpers/http-helper'
import { HttpResponse, Controller } from '@/presentation/protocols'
import { MissingParamError } from '@/presentation/errors'
import { VerifyEmail } from '@/domain/usecases'

export class VerifyEmailController implements Controller {
  constructor (
    private readonly verifyEmail: VerifyEmail
  ) { }

  async handle (request: VerifyEmailController.Request): Promise<HttpResponse> {
    try {
      const requiredFields = ['id']
      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const verified = await this.verifyEmail.verify(request.id)

      if (verified) {
        return html('<html> <body> <h1>Email Verificado!</h1> </body> </html>')
      }

      return unauthorized()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace VerifyEmailController {
  export interface Request {
    id: string
  }
}
