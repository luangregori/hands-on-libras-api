import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log'
import { LogMongoRepositoiry } from '@/infra/db/mongodb/log-repository/log'
import { LoadChallengesController } from '@/presentation/controllers/load-challenges/load-challenges'
import { DbLoadChallenges } from '@/data/usecases/load-challenges/load-challenges'
import { ChallengeMongoRepository } from '@/infra/db/mongodb/challenge-repository/challenge'
import { StartChallengeController } from '@/presentation/controllers/start-challenge/start-challenge'
import { DbStartChallenge } from '@/data/usecases/start-challenge/start-challenge'
import { TestResultMongoRepository } from '@/infra/db/mongodb/test-result-repository/test-result'

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
