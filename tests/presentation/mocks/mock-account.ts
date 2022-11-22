import faker from 'faker'
import {
  AddAccount,
  Authentication,
  CheckEmailAccount,
  LoadUserScore,
  AuthUserByToken,
  LoadUserInfo,
  UpdateAccount,
  SendEmailVerification
} from '@/domain/usecases'
import { EmailValidator } from '@/presentation/protocols/email-validator'
import { mockAccountModel, mockAchievementModel } from '@/tests/domain/mocks'

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

export class LoadUserInfoSpy implements LoadUserInfo {
  accountId: string
  result = {
    name: faker.name.findName(),
    image_url: faker.image.imageUrl(),
    score: faker.datatype.number(),
    ranking: faker.datatype.number(),
    achievements: [mockAchievementModel()]
  }

  async load (accountId: string): Promise<LoadUserInfo.Result> {
    this.accountId = accountId
    return this.result
  }
}

export class UpdateAccountSpy implements UpdateAccount {
  params: UpdateAccount.Params
  result = mockAccountModel()

  async updateById (accountId: string, params: UpdateAccount.Params): Promise<UpdateAccount.Result> {
    this.params = params
    return this.result
  }
}

export class SendEmailVerificationSpy implements SendEmailVerification {
  email: string

  async sendEmailVerification (email: string): Promise<void> {
    this.email = email
  }
}
