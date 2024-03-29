import { HttpResponse, Controller } from '@/presentation/protocols'
import { MissingParamError, InvalidParamError, EmailAlreadyRegisteredError } from '@/presentation/errors'
import { badRequest, serverError, ok, forbidden } from '@/presentation/helpers/http-helper'
import { AddAccount, CheckEmailAccount, Authentication, SendEmailVerification } from '@/domain/usecases'
import { EmailValidator } from '@/presentation/protocols/email-validator'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly checkEmailAccount: CheckEmailAccount,
    private readonly authentication: Authentication,
    private readonly sendEmailVerification: SendEmailVerification
  ) { }

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = request

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const emailAlreadyRegistered = await this.checkEmailAccount.check(email)
      if (emailAlreadyRegistered) {
        return forbidden(new EmailAlreadyRegisteredError())
      }

      await this.addAccount.add({
        name,
        email,
        password
      })

      await this.sendEmailVerification.sendEmailVerification(email)

      const authenticationModel = await this.authentication.auth({
        email,
        password
      })
      return ok(authenticationModel)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SignUpController {
  export interface Request {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }
}
