import { Controller } from '../../presentation/protocols'
import { LoginController } from '../../presentation/controllers/login/login'
import { LogMongoRepositoiry } from '../../infra/db/mongodb/log-repository/log'
import { LogControllerDecorator } from '../decorators/log'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { DbAuthentication } from '../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { JwtAdapter } from '../../infra/criptography/jwt-adapter'
import env from '../config/env'

export const makeLoginController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const authentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter)
  const logMongoRepositoiry = new LogMongoRepositoiry()
  const loginController = new LoginController(authentication)
  return new LogControllerDecorator(loginController, logMongoRepositoiry)
}
