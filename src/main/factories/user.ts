import env from '@/main/config/env'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators'
import { EmailValidatorAdapter } from '@/infra/validators'
import {
  LoginController,
  SignUpController,
  UserInfoController,
  UpdateUserInfoController,
  VerifyEmailController,
  RecoverPasswordController,
  ConfirmCodeController,
  NewPasswordController
} from '@/presentation/controllers'
import {
  DbAddAccount,
  DbCheckEmailAccount,
  DbAuthentication,
  DbLoadUserInfo,
  DbLoadUserScore,
  DbUpdateAccount,
  DbLoadRanking,
  DbSendEmail,
  DbVerifyEmail,
  DbSendEmailRecover
} from '@/data/usecases'
import {
  LogMongoRepository,
  AccountMongoRepository,
  ChallengeResultMongoRepository,
  AchievementMongoRepository
} from '@/infra/db/'
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography'
import { NodeMailerAdapter } from '@/infra/remote'

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
  const nodeMailerAdapter = new NodeMailerAdapter(
    env.nodeMailerConfig.host,
    Number(env.nodeMailerConfig.port),
    env.nodeMailerConfig.user,
    env.nodeMailerConfig.pass
  )
  const sendEmailVerification = new DbSendEmail(nodeMailerAdapter, accountMongoRepository)
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount, checkEmailAccount, authentication, sendEmailVerification)
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
  const dbUpdateAccount = new DbUpdateAccount(accountMongoRepository, bcryptAdapter, accountMongoRepository, bcryptAdapter)
  const updateUserInfoController = new UpdateUserInfoController(dbUpdateAccount)
  return new LogControllerDecorator(updateUserInfoController, logMongoRepository)
}

export const makeVerifyEmailController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const dbVerifyEmail = new DbVerifyEmail(accountMongoRepository, accountMongoRepository)
  const logMongoRepository = new LogMongoRepository()
  const verifyEmailController = new VerifyEmailController(dbVerifyEmail)
  return new LogControllerDecorator(verifyEmailController, logMongoRepository)
}

export const makeRecoverPasswordController = (): Controller => {
  const salt = 12
  const nodeMailerAdapter = new NodeMailerAdapter(
    env.nodeMailerConfig.host,
    Number(env.nodeMailerConfig.port),
    env.nodeMailerConfig.user,
    env.nodeMailerConfig.pass
  )
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbSendEmailRecover = new DbSendEmailRecover(accountMongoRepository, nodeMailerAdapter, bcryptAdapter, accountMongoRepository)
  const logMongoRepository = new LogMongoRepository()
  const recoverPasswordController = new RecoverPasswordController(dbSendEmailRecover)
  return new LogControllerDecorator(recoverPasswordController, logMongoRepository)
}

export const makeConfirmCodeController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const authentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter)
  const logMongoRepository = new LogMongoRepository()
  const confirmCodeController = new ConfirmCodeController(authentication)
  return new LogControllerDecorator(confirmCodeController, logMongoRepository)
}

export const makeNewPasswordController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const logMongoRepository = new LogMongoRepository()
  const dbUpdateAccount = new DbUpdateAccount(accountMongoRepository, bcryptAdapter, accountMongoRepository, bcryptAdapter)
  const newPasswordController = new NewPasswordController(dbUpdateAccount)
  return new LogControllerDecorator(newPasswordController, logMongoRepository)
}
