import { Controller } from '@/presentation/protocols'
import { LoadRankingController } from '@/presentation/controllers'
import { LogMongoRepositoiry, AccountMongoRepository, TestResultMongoRepository } from '@/infra/db'
import { LogControllerDecorator } from '@/main/decorators'
import { DbLoadRanking } from '@/data/usecases'

export const makeLoadRankingController = (): Controller => {
  const testResultMongoRepository = new TestResultMongoRepository()
  const accountMongoRepository = new AccountMongoRepository()
  const loadRanking = new DbLoadRanking(testResultMongoRepository, accountMongoRepository)
  const logMongoRepositoiry = new LogMongoRepositoiry()
  const loadRankingController = new LoadRankingController(loadRanking)
  return new LogControllerDecorator(loadRankingController, logMongoRepositoiry)
}
