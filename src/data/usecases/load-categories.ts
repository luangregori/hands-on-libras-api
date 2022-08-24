import { LoadCategories } from '@/domain/usecases'
import { FindAllCategoriesRepository } from '@/data/protocols'
export class DbLoadCategories implements LoadCategories {
  constructor (
    private readonly findAllCategoriesRepository: FindAllCategoriesRepository
  ) {}

  async load (): Promise<LoadCategories.Result> {
    return await this.findAllCategoriesRepository.findAll()
  }
}
