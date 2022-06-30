import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log'
import { LogMongoRepositoiry } from '@/infra/db/mongodb/log-repository/log'
import { LoadCategoriesController } from '@/presentation/controllers/load-categories/load-categories'
import { DbLoadCategories } from '@/data/usecases/load-categories/load-categories'
import { CategoryMongoRepository } from '@/infra/db/mongodb/category-repository/category'

export const makeFindAllCategoriesController = (): Controller => {
  const categoryMongoRepository = new CategoryMongoRepository()
  const dbLoadCategories = new DbLoadCategories(categoryMongoRepository)
  const loadCategoriesController = new LoadCategoriesController(dbLoadCategories)
  const logMongoRepositoiry = new LogMongoRepositoiry()
  return new LogControllerDecorator(loadCategoriesController, logMongoRepositoiry)
}
