import { Controller } from '@/presentation/protocols'
import { LoadRankingController } from '@/presentation/controllers'
import { LogMongoRepository, AccountMongoRepository, ChallengeResultMongoRepository } from '@/infra/db'
import { LogControllerDecorator } from '@/main/decorators'
import { DbLoadRanking } from '@/data/usecases'

export const makeLoadRankingController = (): Controller => {
  const challengeResultMongoRepository = new ChallengeResultMongoRepository()
  const accountMongoRepository = new AccountMongoRepository()
  const loadRanking = new DbLoadRanking(challengeResultMongoRepository, accountMongoRepository)
  const logMongoRepository = new LogMongoRepository()
  const loadRankingController = new LoadRankingController(loadRanking)
  return new LogControllerDecorator(loadRankingController, logMongoRepository)
}
