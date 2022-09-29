import faker from 'faker'
import { AddAccount, Authentication, CheckEmailAccount, LoadUserScore, AuthUserByToken } from '@/domain/usecases'
import { EmailValidator } from '@/presentation/protocols/email-validator'
import { mockAccountModel } from '@/tests/domain/mocks'

export class AddAccountSpy implements AddAccount {
  params: AddAccount.Params
  result = mockAccountModel()

  async add (params: AddAccount.Params): Promise<AddAccount.Result> {
    this.params = params
    return this.result
  }
}

export class CheckEmailAccountSpy implements CheckEmailAccount {
  result = false

  async check (email: string): Promise<boolean> {
    return this.result
  }
}

export class AuthenticationSpy implements Authentication {
  params: Authentication.Params
  result = {
    accessToken: faker.datatype.uuid(),
    expiresIn: faker.datatype.number(),
    name: faker.name.findName()
  }

  async auth (params: Authentication.Params): Promise<Authentication.Result> {
    this.params = params
    return this.result
  }
}

export class LoadUserScoreSpy implements LoadUserScore {
  result = faker.datatype.number()

  async load (accountId: string): Promise<number> {
    return this.result
  }
}

export class EmailValidatorSpy implements EmailValidator {
  result = true

  isValid (email: string): boolean {
    return this.result
  }
}

export class AuthUserByTokenSpy implements AuthUserByToken {
  accessToken: string
  role: string
  result = {
    id: faker.datatype.uuid()
  }

  async auth (accessToken: string): Promise<AuthUserByToken.Result> {
    this.accessToken = accessToken
    return this.result
  }
}
