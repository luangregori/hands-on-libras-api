import { LoadCategories, FindAllCategoriesRepository } from './load-categories-protocols'

export class DbLoadCategories implements LoadCategories {
  constructor (
    private readonly findAllCategoriesRepository: FindAllCategoriesRepository
  ) {}

  async load (): Promise<LoadCategories.Result> {
    return await this.findAllCategoriesRepository.findAll()
  }
}
