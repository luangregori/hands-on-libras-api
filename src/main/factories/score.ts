import { Controller } from '@/presentation/protocols'
import { ScoreController } from '@/presentation/controllers'
import { LogMongoRepositoiry, TestResultMongoRepository } from '@/infra/db'
import { LogControllerDecorator } from '@/main/decorators'
import { DbLoadUserScore } from '@/data/usecases'

export const makeScoreController = (): Controller => {
  const testResultMongoRepository = new TestResultMongoRepository()
  const loadUserScore = new DbLoadUserScore(testResultMongoRepository)
  const logMongoRepositoiry = new LogMongoRepositoiry()
  const scoreController = new ScoreController(loadUserScore)
  return new LogControllerDecorator(scoreController, logMongoRepositoiry)
}
