import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators'
import { LogMongoRepositoiry, ChallengeMongoRepository, TestResultMongoRepository } from '@/infra/db'
import { LoadChallengesController, StartChallengeController } from '@/presentation/controllers'
import { DbLoadChallenges, DbStartChallenge } from '@/data/usecases'

export const makeLoadChallengesController = (): Controller => {
  const challengeMongoRepository = new ChallengeMongoRepository()
  const dbLoadChallenges = new DbLoadChallenges(challengeMongoRepository, challengeMongoRepository)
  const loadCategoriesController = new LoadChallengesController(dbLoadChallenges)
  const logMongoRepositoiry = new LogMongoRepositoiry()
  return new LogControllerDecorator(loadCategoriesController, logMongoRepositoiry)
}

export const makeStartChallengeController = (): Controller => {
  const challengeMongoRepository = new ChallengeMongoRepository()
  const testResultMongoRepository = new TestResultMongoRepository()
  const dbStartChallenge = new DbStartChallenge(challengeMongoRepository, testResultMongoRepository)
  const startChallengeController = new StartChallengeController(dbStartChallenge)
  const logMongoRepositoiry = new LogMongoRepositoiry()
  return new LogControllerDecorator(startChallengeController, logMongoRepositoiry)
}
