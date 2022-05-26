import { HttpResponse, HttpRequest, Controller, EmailValidator, AddAccount, CheckEmailAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError, EmailAlreadyRegisteredError } from '../../erros'
import { badRequest, serverError, ok, forbidden } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly checkEmailAccount: CheckEmailAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, checkEmailAccount: CheckEmailAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.checkEmailAccount = checkEmailAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body

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

      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
