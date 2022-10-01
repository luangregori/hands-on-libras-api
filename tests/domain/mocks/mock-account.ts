import { AddAccount, Authentication, UpdateAccount } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'

import faker from 'faker'

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAccountModel = (): AccountModel => ({
  id: faker.name.findName(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockUpdateAccountParams = (): UpdateAccount.Params => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  image_url: faker.internet.url(),
  newPassword: faker.internet.password(),
  oldPassword: faker.internet.password()
})

export const mockAccountId = (): string => faker.datatype.uuid()
