import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log'
import { LogMongoRepositoiry } from '@/infra/db/mongodb/log-repository/log'
import { LoadChallengesController } from '@/presentation/controllers/load-challenges/load-challenges'
import { DbLoadChallenges } from '@/data/usecases/load-challenges/load-challenges'
import { ChallengeMongoRepository } from '@/infra/db/mongodb/challenge-repository/challenge'

export const makeLoadChallengesController = (): Controller => {
  const challengeMongoRepository = new ChallengeMongoRepository()
  const dbLoadChallenges = new DbLoadChallenges(challengeMongoRepository, challengeMongoRepository)
  const loadCategoriesController = new LoadChallengesController(dbLoadChallenges)
  const logMongoRepositoiry = new LogMongoRepositoiry()
  return new LogControllerDecorator(loadCategoriesController, logMongoRepositoiry)
}
