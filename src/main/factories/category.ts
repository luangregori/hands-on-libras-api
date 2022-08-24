import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log'
import { LogMongoRepositoiry, CategoryMongoRepository } from '@/infra/db'
import { LoadCategoriesController } from '@/presentation/controllers/'
import { DbLoadCategories } from '@/data/usecases/'

export const makeFindAllCategoriesController = (): Controller => {
  const categoryMongoRepository = new CategoryMongoRepository()
  const dbLoadCategories = new DbLoadCategories(categoryMongoRepository)
  const loadCategoriesController = new LoadCategoriesController(dbLoadCategories)
  const logMongoRepositoiry = new LogMongoRepositoiry()
  return new LogControllerDecorator(loadCategoriesController, logMongoRepositoiry)
}
