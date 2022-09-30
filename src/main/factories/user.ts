import env from '@/main/config/env'
import { LoginController, SignUpController, UserInfoController } from '@/presentation/controllers'
import { EmailValidatorAdapter } from '@/infra/validators'
import { DbAddAccount, DbCheckEmailAccount, DbAuthentication, DbLoadUserInfo } from '@/data/usecases'
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography'
import { LogMongoRepository, AccountMongoRepository } from '@/infra/db/'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators'

export const makeLoginController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const authentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter)
  const logMongoRepository = new LogMongoRepository()
  const loginController = new LoginController(authentication)
  return new LogControllerDecorator(loginController, logMongoRepository)
}

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const logMongoRepository = new LogMongoRepository()
  const checkEmailAccount = new DbCheckEmailAccount(accountMongoRepository)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const authentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter)
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount, checkEmailAccount, authentication)
  return new LogControllerDecorator(signUpController, logMongoRepository)
}

export const makeUserInfoController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const logMongoRepository = new LogMongoRepository()
  const dbLoadUserInfo = new DbLoadUserInfo(accountMongoRepository)
  const userInfoController = new UserInfoController(dbLoadUserInfo)
  return new LogControllerDecorator(userInfoController, logMongoRepository)
}
