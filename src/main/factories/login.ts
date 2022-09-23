import env from '@/main/config/env'
import { Controller } from '@/presentation/protocols'
import { LoginController } from '@/presentation/controllers'
import { LogMongoRepository, AccountMongoRepository } from '@/infra/db'
import { LogControllerDecorator } from '@/main/decorators'
import { DbAuthentication } from '@/data/usecases'
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography'

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
