import { Controller } from '@/presentation/protocols'
import { ScoreController } from '@/presentation/controllers'
import { LogMongoRepository, ChallengeResultMongoRepository } from '@/infra/db'
import { LogControllerDecorator } from '@/main/decorators'
import { DbLoadUserScore } from '@/data/usecases'

export const makeScoreController = (): Controller => {
  const challengeResultMongoRepository = new ChallengeResultMongoRepository()
  const loadUserScore = new DbLoadUserScore(challengeResultMongoRepository)
  const logMongoRepository = new LogMongoRepository()
  const scoreController = new ScoreController(loadUserScore)
  return new LogControllerDecorator(scoreController, logMongoRepository)
}
