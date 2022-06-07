import env from '../config/env'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepositoiry } from '../../infra/db/mongodb/log-repository/log'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { DbCheckEmailAccount } from '../../data/usecases/check-email-account/check-email-account'
import { DbAuthentication } from '../../data/usecases/authentication/db-authentication'
import { JwtAdapter } from '../../infra/criptography/jwt-adapter'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const logMongoRepositoiry = new LogMongoRepositoiry()
  const checkEmailAccount = new DbCheckEmailAccount(accountMongoRepository)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const authentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter)
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount, checkEmailAccount, authentication)
  return new LogControllerDecorator(signUpController, logMongoRepositoiry)
}
