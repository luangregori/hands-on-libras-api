import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log'
import { LogMongoRepository, CategoryMongoRepository } from '@/infra/db'
import { LoadCategoriesController } from '@/presentation/controllers/'
import { DbLoadCategories } from '@/data/usecases/'

export const makeFindAllCategoriesController = (): Controller => {
  const categoryMongoRepository = new CategoryMongoRepository()
  const dbLoadCategories = new DbLoadCategories(categoryMongoRepository)
  const loadCategoriesController = new LoadCategoriesController(dbLoadCategories)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loadCategoriesController, logMongoRepository)
}
