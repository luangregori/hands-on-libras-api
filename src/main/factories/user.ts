import env from '@/main/config/env'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators'
import { EmailValidatorAdapter } from '@/infra/validators'
import {
  LoginController,
  SignUpController,
  UserInfoController,
  UpdateUserInfoController
} from '@/presentation/controllers'
import {
  DbAddAccount,
  DbCheckEmailAccount,
  DbAuthentication,
  DbLoadUserInfo,
  DbLoadUserScore,
  DbUpdateAccount,
  DbLoadRanking
} from '@/data/usecases'
import {
  LogMongoRepository,
  AccountMongoRepository,
  ChallengeResultMongoRepository,
  AchievementMongoRepository
} from '@/infra/db/'
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
  const challengeResultMongoRepository = new ChallengeResultMongoRepository()
  const achievementMongoRepository = new AchievementMongoRepository()
  const dbLoadUserInfo = new DbLoadUserInfo(accountMongoRepository, achievementMongoRepository)
  const dbLoadUserScore = new DbLoadUserScore(challengeResultMongoRepository)
  const dbLoadRanking = new DbLoadRanking(challengeResultMongoRepository, accountMongoRepository)
  const userInfoController = new UserInfoController(dbLoadUserInfo, dbLoadUserScore, dbLoadRanking)
  return new LogControllerDecorator(userInfoController, logMongoRepository)
}

export const makeUpdateUserInfoController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const logMongoRepository = new LogMongoRepository()
  const dbUpdateAccount = new DbUpdateAccount(accountMongoRepository, bcryptAdapter, accountMongoRepository)
  const updateUserInfoController = new UpdateUserInfoController(dbUpdateAccount)
  return new LogControllerDecorator(updateUserInfoController, logMongoRepository)
}
